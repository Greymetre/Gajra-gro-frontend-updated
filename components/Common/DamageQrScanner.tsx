import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { backendGetDamageEntryImage } from '../../helpers/backend_helper';
import { base64ToBlob, decodeQr, extractCouponCode } from '../../utils/qrScanner';

interface DamageQrScannerProps {
  invalidCouponid: string;
  images: string[];
  onDetected: (couponCode: string) => void;
  children: React.ReactNode; // the regular image viewer, shown when the lens is closed
}

type ScanStatus = { type: 'idle' | 'loading' | 'success' | 'error'; message: string };

const MIN_LENS = 60;
const MAX_LENS = 320;
const LENS_SCAN_INTERVAL = 200;

const DamageQrScanner: React.FC<DamageQrScannerProps> = ({ invalidCouponid, images, onDetected, children }) => {
  const [status, setStatus] = useState<ScanStatus>({ type: 'idle', message: '' });
  const [lensMode, setLensMode] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [lens, setLens] = useState({ x: 0, y: 0, size: 140, visible: false });

  const blobCache = useRef<Map<number, Blob>>(new Map());
  const sourceCanvas = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const lensAreaRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef(lens);
  const scanBusy = useRef(false);
  const scanPending = useRef(false);
  const lastScanAt = useRef(0);
  const detected = useRef(false);
  const trailingScan = useRef<ReturnType<typeof setTimeout> | null>(null);

  lensRef.current = lens;

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  useEffect(() => () => {
    if (trailingScan.current) clearTimeout(trailingScan.current);
  }, []);

  const loadImageBlob = async (index: number): Promise<Blob> => {
    const cached = blobCache.current.get(index);
    if (cached) return cached;
    const res = await backendGetDamageEntryImage({ invalidCouponid, index });
    const blob = base64ToBlob(res.data.base64, res.data.contentType);
    blobCache.current.set(index, blob);
    return blob;
  };

  const handleDetected = (text: string) => {
    const couponCode = extractCouponCode(text);
    detected.current = true;
    onDetected(couponCode);
    setStatus({ type: 'success', message: `QR scanned: ${couponCode}` });
  };

  const getErrorMessage = (error: any) =>
    error?.response?.data?.message || error?.message || 'Could not load image';

  const openLens = async (index: number) => {
    setStatus({ type: 'loading', message: 'Loading image...' });
    try {
      const blob = await loadImageBlob(index);
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
      bitmap.close();
      sourceCanvas.current = canvas;
      detected.current = false;
      setImageIndex(index);
      setImageUrl(URL.createObjectURL(blob));
      setLensMode(true);
      setStatus({ type: 'idle', message: 'Move the mouse over the QR code. Use the scroll wheel to resize the box.' });
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) });
    }
  };

  const closeLens = () => {
    setLensMode(false);
    setImageUrl('');
    sourceCanvas.current = null;
  };

  const handleAutoScan = async () => {
    setStatus({ type: 'loading', message: 'Scanning image...' });
    try {
      for (let index = 0; index < images.length; index++) {
        const text = await decodeQr(await loadImageBlob(index));
        if (text) {
          closeLens();
          handleDetected(text);
          return;
        }
      }
      await openLens(0);
      setStatus({ type: 'error', message: 'QR not detected automatically. Move the mouse over the QR code to scan it.' });
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) });
    }
  };

  const scanLensArea = useCallback(async () => {
    const canvas = sourceCanvas.current;
    const img = imgRef.current;
    if (!canvas || !img || detected.current) return;
    if (scanBusy.current) {
      scanPending.current = true;
      return;
    }
    scanBusy.current = true;
    lastScanAt.current = Date.now();

    try {
      const { x, y, size } = lensRef.current;
      const scale = canvas.width / img.clientWidth;
      const sourceSize = Math.min(Math.round(size * scale), canvas.width, canvas.height);
      const sx = Math.max(0, Math.min(Math.round((x - size / 2) * scale), canvas.width - sourceSize));
      const sy = Math.max(0, Math.min(Math.round((y - size / 2) * scale), canvas.height - sourceSize));
      // Upscale small crops so each QR module covers enough pixels to be read.
      const targetSize = Math.min(Math.max(sourceSize, 480), 1000);

      const crop = document.createElement('canvas');
      crop.width = targetSize;
      crop.height = targetSize;
      const ctx = crop.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(canvas, sx, sy, sourceSize, sourceSize, 0, 0, targetSize, targetSize);

      const text = await decodeQr(ctx.getImageData(0, 0, targetSize, targetSize));
      if (text && !detected.current) {
        handleDetected(text);
        setTimeout(closeLens, 700);
      }
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) });
    } finally {
      scanBusy.current = false;
      if (scanPending.current && !detected.current) {
        scanPending.current = false;
        setTimeout(scanLensArea, LENS_SCAN_INTERVAL);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDetected]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    setLens((prev) => ({ ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true }));
    // Throttle while moving, and always scan the position where the mouse stops.
    if (trailingScan.current) clearTimeout(trailingScan.current);
    if (Date.now() - lastScanAt.current >= LENS_SCAN_INTERVAL) {
      scanLensArea();
    } else {
      trailingScan.current = setTimeout(scanLensArea, LENS_SCAN_INTERVAL);
    }
  };

  // React registers wheel listeners as passive, so preventDefault needs a native listener.
  useEffect(() => {
    const area = lensAreaRef.current;
    if (!lensMode || !area) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setLens((prev) => ({
        ...prev,
        size: Math.max(MIN_LENS, Math.min(MAX_LENS, prev.size - Math.sign(e.deltaY) * 15)),
      }));
      if (trailingScan.current) clearTimeout(trailingScan.current);
      trailingScan.current = setTimeout(scanLensArea, LENS_SCAN_INTERVAL);
    };
    area.addEventListener('wheel', handleWheel, { passive: false });
    return () => area.removeEventListener('wheel', handleWheel);
  }, [lensMode, scanLensArea]);

  const statusColor = { idle: 'text-muted', loading: 'text-muted', success: 'text-success', error: 'text-danger' }[status.type];
  const isLoading = status.type === 'loading';

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <div className="d-flex gap-2 mb-2 flex-wrap justify-content-center">
        <Button size="sm" variant="primary" onClick={handleAutoScan} disabled={isLoading || !images.length}>
          Scan QR
        </Button>
        {lensMode ? (
          <Button size="sm" variant="outline-secondary" onClick={closeLens}>
            Close Scanner
          </Button>
        ) : (
          <Button size="sm" variant="outline-primary" onClick={() => openLens(imageIndex)} disabled={isLoading || !images.length}>
            Scan with Mouse
          </Button>
        )}
        {lensMode && images.length > 1 && images.map((_, index) => (
          <Button
            key={index}
            size="sm"
            variant={index === imageIndex ? 'secondary' : 'outline-secondary'}
            onClick={() => openLens(index)}
          >
            Image {index + 1}
          </Button>
        ))}
      </div>

      {status.message && (
        <div className={`small mb-2 text-center ${statusColor}`}>
          {isLoading && <Spinner animation="border" size="sm" className="me-1" />}
          {status.message}
        </div>
      )}

      {lensMode && imageUrl ? (
        <div
          ref={lensAreaRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setLens((prev) => ({ ...prev, visible: false }))}
          onClick={scanLensArea}
          style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', cursor: 'crosshair', lineHeight: 0 }}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Damage entry"
            draggable={false}
            style={{ display: 'block', maxWidth: '100%', maxHeight: 420, userSelect: 'none' }}
          />
          {lens.visible && (
            <div
              style={{
                position: 'absolute',
                left: lens.x - lens.size / 2,
                top: lens.y - lens.size / 2,
                width: lens.size,
                height: lens.size,
                border: `2px solid ${status.type === 'success' ? '#198754' : '#0d6efd'}`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default DamageQrScanner;

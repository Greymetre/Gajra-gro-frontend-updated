import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

export interface KycViewerImage {
  src: string;
  label: string;
}

export interface KycViewerField {
  label: string;
  value?: any;
}

const LENS_SIZE = 180;
const MIN_ZOOM = 1.5;
const MAX_ZOOM = 6;

/**
 * Image with a circular magnifier lens that follows the pointer.
 * Rotation is applied to the wrapper, and the pointer position is mapped back
 * into the unrotated image space so the lens always shows what is under it.
 */
const ImageMagnifier = ({
  src,
  zoom,
  rotation,
  lensEnabled,
}: {
  src: string;
  zoom: number;
  rotation: number;
  lensEnabled: boolean;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const img = imgRef.current;
    if (!img || !lensEnabled) return;
    const rect = img.getBoundingClientRect();
    const w = img.offsetWidth;
    const h = img.offsetHeight;
    // Offset from the visual centre, rotated back into image space.
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const rad = (-rotation * Math.PI) / 180;
    const x = dx * Math.cos(rad) - dy * Math.sin(rad) + w / 2;
    const y = dx * Math.sin(rad) + dy * Math.cos(rad) + h / 2;
    if (x < 0 || y < 0 || x > w || y > h) {
      setLens(null);
      return;
    }
    setLens({ x, y });
  };

  const img = imgRef.current;
  const w = img?.offsetWidth || 0;
  const h = img?.offsetHeight || 0;

  return (
    <div
      className={`kyc-mag-stage ${lensEnabled ? "kyc-mag-active" : ""}`}
      onPointerMove={handleMove}
      onPointerLeave={() => setLens(null)}
    >
      <div
        className="kyc-mag-rotor"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <img
          ref={imgRef}
          src={src}
          alt="KYC document"
          draggable={false}
          className="kyc-mag-img"
        />
        {lensEnabled && lens ? (
          <div
            className="kyc-mag-lens"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: lens.x - LENS_SIZE / 2,
              top: lens.y - LENS_SIZE / 2,
              backgroundImage: `url("${src}")`,
              backgroundSize: `${w * zoom}px ${h * zoom}px`,
              backgroundPosition: `${-(lens.x * zoom - LENS_SIZE / 2)}px ${-(
                lens.y * zoom -
                LENS_SIZE / 2
              )}px`,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const KycImageViewer = ({
  show,
  onHide,
  title,
  images,
  initialIndex = 0,
  fields,
  verified,
  canVerify,
  onVerify,
  onReject,
}: {
  show: boolean;
  onHide: () => void;
  title: string;
  images: KycViewerImage[];
  initialIndex?: number;
  fields: KycViewerField[];
  verified?: boolean;
  canVerify: boolean;
  onVerify: () => Promise<boolean | void>;
  onReject: () => Promise<boolean | void>;
}) => {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(2.5);
  const [rotation, setRotation] = useState(0);
  const [lensEnabled, setLensEnabled] = useState(true);
  const [busy, setBusy] = useState<"verify" | "reject" | null>(null);
  const [result, setResult] = useState<"verified" | "rejected" | null>(null);

  useEffect(() => {
    if (show) {
      setIndex(initialIndex);
      setRotation(0);
      setResult(null);
    }
  }, [show, initialIndex]);

  const current = images[index];

  const run = async (kind: "verify" | "reject") => {
    setBusy(kind);
    try {
      // The parent refreshes the KYC data on success; close so the updated
      // page is visible straight away.
      const ok = await (kind === "verify" ? onVerify() : onReject());
      if (ok) {
        setResult(kind === "verify" ? "verified" : "rejected");
        onHide();
      }
    } finally {
      setBusy(null);
    }
  };

  const status =
    result === "verified" || (!result && verified)
      ? { text: "Verified", cls: "cd-badge-success" }
      : result === "rejected"
      ? { text: "Rejected", cls: "cd-badge-danger" }
      : { text: "Not Verified", cls: "cd-badge-warn" };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName="kyc-viewer-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="kyc-viewer-title">
          {title}
          <span className={`cd-badge ${status.cls}`}>{status.text}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="kyc-viewer-body">
        <div className="kyc-viewer-image">
          <div className="kyc-viewer-tools">
            <Button
              size="sm"
              variant={lensEnabled ? "dark" : "outline-secondary"}
              onClick={() => setLensEnabled(!lensEnabled)}
            >
              🔍 Lens {lensEnabled ? "On" : "Off"}
            </Button>
            <div className="kyc-zoom">
              <span>Zoom</span>
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.5}
                value={zoom}
                disabled={!lensEnabled}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
              <span className="kyc-zoom-val">{zoom}x</span>
            </div>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => setRotation((r) => (r + 90) % 360)}
            >
              ⟳ Rotate
            </Button>
            {current ? (
              <a
                className="btn btn-sm btn-outline-secondary"
                href={current.src}
                target="_blank"
                rel="noreferrer"
              >
                Open original
              </a>
            ) : null}
          </div>

          {current ? (
            <ImageMagnifier
              key={current.src}
              src={current.src}
              zoom={zoom}
              rotation={rotation}
              lensEnabled={lensEnabled}
            />
          ) : (
            <div className="kyc-mag-stage kyc-mag-empty">No image</div>
          )}

          {images.length > 1 ? (
            <div className="kyc-thumbs">
              {images.map((img, i) => (
                <button
                  type="button"
                  key={img.src + i}
                  className={`kyc-thumb ${i === index ? "active" : ""}`}
                  onClick={() => {
                    setIndex(i);
                    setRotation(0);
                  }}
                >
                  <img src={img.src} alt={img.label} />
                  <span>{img.label}</span>
                </button>
              ))}
            </div>
          ) : null}
          <p className="cd-muted-note mb-0">
            Move the cursor over the image to magnify. Use Rotate for sideways
            photos.
          </p>
        </div>

        <div className="kyc-viewer-details">
          <h6 className="cd-section-title">Cross-check Details</h6>
          <div className="kyc-viewer-fields">
            {fields.map((f) => (
              <div className="cd-field" key={f.label}>
                <label>{f.label}</label>
                <span className="kyc-viewer-value">
                  {f.value !== undefined && f.value !== null && f.value !== ""
                    ? String(f.value)
                    : "-"}
                </span>
              </div>
            ))}
          </div>

          <div className="kyc-viewer-actions">
            {canVerify ? (
              <>
                <Button
                  variant="success"
                  className="cd-btn"
                  disabled={!!busy || result === "verified"}
                  onClick={() => run("verify")}
                >
                  {busy === "verify" ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : (
                    "✓ Verify"
                  )}
                </Button>
                <Button
                  variant="outline-danger"
                  className="cd-btn"
                  disabled={!!busy || result === "rejected"}
                  onClick={() => run("reject")}
                >
                  {busy === "reject" ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : (
                    "✕ Reject"
                  )}
                </Button>
              </>
            ) : (
              <p className="cd-muted-note mb-0">
                Save the document number or image first to verify.
              </p>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default KycImageViewer;

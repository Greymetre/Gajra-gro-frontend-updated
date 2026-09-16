import type { ReaderOptions } from 'zxing-wasm/reader';

const READER_OPTIONS: ReaderOptions = {
  formats: ['QRCode'],
  tryHarder: true,
  tryRotate: true,
  tryInvert: true,
  tryDownscale: true,
  maxNumberOfSymbols: 1,
};

let readerPromise: Promise<typeof import('zxing-wasm/reader')> | null = null;

// Loaded lazily in the browser; the wasm binary is served from /public/zxing
// (copied on postinstall) so scanning does not depend on a third-party CDN.
const getReader = () => {
  if (!readerPromise) {
    readerPromise = import('zxing-wasm/reader').then((reader) => {
      reader.prepareZXingModule({
        overrides: {
          locateFile: (path: string, prefix: string) =>
            path.endsWith('.wasm') ? `/zxing/${path}` : prefix + path,
        },
      });
      return reader;
    });
  }
  return readerPromise;
};

export const decodeQr = async (input: Blob | ImageData): Promise<string | null> => {
  const { readBarcodes } = await getReader();
  const results = await readBarcodes(input, READER_OPTIONS);
  const match = results.find((result) => result.isValid && result.text.trim());
  return match ? match.text.trim() : null;
};

// Coupons are 8 character codes. If the QR holds a URL, pick the code out of
// its query values or path segments; otherwise use the text as it is.
export const extractCouponCode = (text: string): string => {
  const value = text.trim();
  const isCoupon = (candidate: string) => /^[A-Za-z0-9]{8}$/.test(candidate);
  if (isCoupon(value)) return value;

  try {
    const url = new URL(value);
    const candidates = [
      ...Array.from(url.searchParams.values()),
      ...url.pathname.split('/').reverse(),
    ];
    const coupon = candidates.find(isCoupon);
    if (coupon) return coupon;
  } catch (e) {
    // Not a URL
  }
  return value;
};

export const base64ToBlob = (base64: string, contentType: string): Blob => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: contentType });
};

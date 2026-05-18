import imageCompression from 'browser-image-compression';

/**
 * Compress an image file before upload.
 * Targets ~300KB max, width 1024px — fast on low-end devices.
 */
export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.3,       // 300KB max
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: 'image/webp', // WebP for smaller size
  };
  try {
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch {
    return file; // fallback: use original if compression fails
  }
}

/**
 * Convert a File to a base64 preview URL.
 * Used for instant local preview before API upload.
 */
export function fileToPreview(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

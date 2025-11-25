/**
 * Image compression utility
 * Compresses images larger than 4.5MB to reduce file size
 */

const MAX_SIZE_BYTES = 4.5 * 1024 * 1024; // 4.5MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY_STEP = 0.1;
const MIN_QUALITY = 0.5;

export interface CompressionOptions {
  maxSizeBytes?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compresses an image file if it's larger than the specified size limit
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<File> - The compressed file (or original if compression not needed)
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const maxSizeBytes = options.maxSizeBytes || MAX_SIZE_BYTES;
  const maxWidth = options.maxWidth || MAX_WIDTH;
  const maxHeight = options.maxHeight || MAX_HEIGHT;
  const initialQuality = options.quality || 0.9;

  // If file is already small enough, return as is
  if (file.size <= maxSizeBytes) {
    return file;
  }

  // Check if it's an image file
  if (!file.type.startsWith('image/')) {
    return file;
  }

  console.log(`Compressing image: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to get under the size limit
        const tryCompress = (quality: number): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              // If blob is small enough or we've reached minimum quality, use it
              if (blob.size <= maxSizeBytes || quality <= MIN_QUALITY) {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  {
                    type: file.type,
                    lastModified: Date.now(),
                  }
                );
                
                console.log(
                  `Compression complete: ${file.name} - ` +
                  `Original: ${(file.size / (1024 * 1024)).toFixed(2)}MB, ` +
                  `Compressed: ${(blob.size / (1024 * 1024)).toFixed(2)}MB ` +
                  `(Quality: ${quality.toFixed(2)})`
                );
                
                resolve(compressedFile);
              } else {
                // Try with lower quality
                tryCompress(Math.max(quality - QUALITY_STEP, MIN_QUALITY));
              }
            },
            file.type,
            quality
          );
        };

        // Start compression with initial quality
        tryCompress(initialQuality);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compresses multiple image files
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @returns Promise<File[]> - Array of compressed files
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> {
  return Promise.all(files.map(file => compressImage(file, options)));
}

/**
 * Checks if a file needs compression
 * @param file - The file to check
 * @param maxSizeBytes - Maximum size in bytes (default: 4.5MB)
 * @returns boolean - True if compression is needed
 */
export function needsCompression(file: File, maxSizeBytes: number = MAX_SIZE_BYTES): boolean {
  return file.size > maxSizeBytes && file.type.startsWith('image/');
}


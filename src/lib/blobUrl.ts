const PRIVATE_BLOB_HOST_MARKER = '.private.blob.vercel-storage.com';

export function isPrivateBlobUrl(src: string) {
  try {
    const url = new URL(src);
    return url.hostname.includes(PRIVATE_BLOB_HOST_MARKER);
  } catch {
    return false;
  }
}

export function toDisplayImageUrl(src: string) {
  if (!src || !isPrivateBlobUrl(src)) {
    return src;
  }

  return `/api/blob-image?url=${encodeURIComponent(src)}`;
}

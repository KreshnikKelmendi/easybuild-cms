import { put, type PutBlobResult } from '@vercel/blob';

const DEFAULT_FOLDER = 'images';

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ensureBlobTokenConfigured() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }
}

export function buildBlobPath(originalName: string, folder = DEFAULT_FOLDER) {
  const extension = originalName.includes('.')
    ? originalName.split('.').pop()?.toLowerCase() ?? 'jpg'
    : 'jpg';
  const baseName = originalName.replace(/\.[^.]+$/, '') || 'upload';
  const safeBaseName = sanitizeSegment(baseName) || 'upload';
  const safeFolder = sanitizeSegment(folder) || DEFAULT_FOLDER;

  return `${safeFolder}/${safeBaseName}-${Date.now()}.${extension}`;
}

export async function uploadToBlob({
  body,
  originalName,
  contentType,
  folder,
}: {
  body: Blob | Buffer;
  originalName: string;
  contentType?: string;
  folder?: string;
}): Promise<PutBlobResult> {
  ensureBlobTokenConfigured();

  return put(buildBlobPath(originalName, folder), body, {
    access: 'public',
    addRandomSuffix: true,
    contentType,
  });
}

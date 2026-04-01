import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  return NextResponse.json({
    success: !!token,
    timestamp: new Date().toISOString(),
    storage: 'vercel-blob',
    checks: {
      BLOB_READ_WRITE_TOKEN: {
        set: !!token,
        preview: token ? `${token.slice(0, 10)}***` : 'NOT SET',
      },
    },
    summary: token
      ? 'Vercel Blob token is configured for server-side uploads.'
      : 'Vercel Blob token is missing. Add BLOB_READ_WRITE_TOKEN to your local and deployment environments.',
  });
}

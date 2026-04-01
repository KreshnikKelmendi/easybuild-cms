import { get } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

function extractBlobPathname(value: string) {
  try {
    const url = new URL(value);
    return url.pathname.replace(/^\/+/, '');
  } catch {
    return value.replace(/^\/+/, '');
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const pathname = request.nextUrl.searchParams.get('pathname');
  const target = url || pathname;

  if (!target) {
    return NextResponse.json(
      { success: false, message: 'Missing Blob URL or pathname' },
      { status: 400 }
    );
  }

  try {
    const result = await get(extractBlobPathname(target), {
      access: 'private',
    });

    if (!result || result.statusCode !== 200) {
      return NextResponse.json(
        { success: false, message: 'Blob not found' },
        { status: 404 }
      );
    }

    return new NextResponse(result.stream, {
      status: result.statusCode,
      headers: {
        'Content-Type': result.blob.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving private blob image:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to serve Blob image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

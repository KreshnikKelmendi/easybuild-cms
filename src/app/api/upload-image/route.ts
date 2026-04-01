import { NextRequest, NextResponse } from 'next/server';
import { uploadToBlob } from '@/lib/blobUpload';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Check if file is too large for Vercel (4.5MB limit)
    const vercelLimit = 4.5 * 1024 * 1024; // 4.5MB
    if (file.size > vercelLimit) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File too large for direct upload. Use chunked upload instead.',
          error: 'FILE_TOO_LARGE_FOR_VERCEL',
          maxSize: '4.5MB',
          recommendedMethod: 'chunked_upload',
          chunkSize: '4MB'
        },
        { status: 413 }
      );
    }

    // Validate file size (configurable limit for smaller files)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '4194304'); // Default 4MB for Vercel
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { success: false, message: `File size must be less than ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    const blob = await uploadToBlob({
      body: file,
      originalName: file.name,
      contentType: file.type,
      folder: 'images',
    });

    console.log('Image uploaded successfully to Vercel Blob:', {
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      type: file.type,
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully to Vercel Blob',
      data: {
        filename: file.name,
        path: blob.url,
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        type: file.type,
      },
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    
    let errorMessage = 'Failed to upload image';
    if (error instanceof Error) {
      if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
        errorMessage = 'Vercel Blob is not configured on the server';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Define proper types for Cloudinary response and error
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
}

interface CloudinaryError {
  message: string;
  http_code?: number;
  name?: string;
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

    // Validate file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `banner-${timestamp}.${extension}`;

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'easybuild-banners',
          public_id: filename.replace(`.${extension}`, ''),
          transformation: [
            { width: 1920, height: 1080, crop: 'fill', quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error: CloudinaryError | null, result: CloudinaryUploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    if (!result || typeof result === 'string') {
      throw new Error('Upload failed - invalid result from Cloudinary');
    }

    const cloudinaryResult = result as CloudinaryUploadResult;

    console.log('Image uploaded to Cloudinary successfully:', {
      filename,
      cloudinaryId: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      size: file.size
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      data: {
        filename,
        path: cloudinaryResult.secure_url,
        cloudinaryId: cloudinaryResult.public_id,
        size: file.size,
        type: file.type,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format
      }
    });

  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    
    let errorMessage = 'Failed to upload image to Cloudinary';
    if (error instanceof Error) {
      if (error.message.includes('Invalid credentials')) {
        errorMessage = 'Cloudinary credentials are invalid. Please check your API keys.';
      } else if (error.message.includes('Upload failed')) {
        errorMessage = 'Cloudinary upload failed. Please try again.';
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

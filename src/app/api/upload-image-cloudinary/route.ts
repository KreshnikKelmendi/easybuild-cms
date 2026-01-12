import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Define proper types for Cloudinary response
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

// Define types for Cloudinary upload options
interface CloudinaryUploadOptions {
  resource_type: 'auto' | 'image' | 'video' | 'raw';
  folder: string;
  public_id: string;
  quality: string;
  fetch_format: string;
}

// Define types for Cloudinary error objects
interface CloudinaryError {
  message?: string;
  http_code?: number;
  error?: string;
  err?: string;
  name?: string;
}

// Handle OPTIONS for CORS
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
    // Validate Cloudinary credentials first
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [];
      if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
      if (!apiKey) missing.push('CLOUDINARY_API_KEY');
      if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

      console.error('Missing Cloudinary environment variables:', missing);
      
      return NextResponse.json(
        {
          success: false,
          message: `Cloudinary configuration error: Missing environment variables: ${missing.join(', ')}`,
          error: 'MISSING_CREDENTIALS',
          details: 'Please ensure all Cloudinary environment variables are set in your production environment.',
          missingVariables: missing,
        },
        { status: 500 }
      );
    }

    // Check if credentials are placeholder values
    if (
      cloudName.includes('your_') ||
      apiKey.includes('your_') ||
      apiSecret.includes('your_')
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cloudinary credentials appear to be placeholder values. Please configure your actual credentials.',
          error: 'INVALID_CREDENTIALS',
          details: 'Replace placeholder values with your actual Cloudinary credentials from the dashboard.',
        },
        { status: 500 }
      );
    }

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
          message: 'File too large for Cloudinary upload. Use chunked upload instead.',
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
      try {
        // Simplified upload options - removed transformations to avoid errors
        // Transformations can be applied later via URL parameters if needed
        const uploadOptions: CloudinaryUploadOptions = {
          resource_type: 'image',
          folder: 'easybuild-banners',
          public_id: filename.replace(`.${extension}`, ''),
          quality: 'auto',
          fetch_format: 'auto',
          // Removed transformation array that might be causing issues
        };

        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error: unknown, result: unknown) => {
            if (error) {
              // Log detailed error information
              const errorObj = error as CloudinaryError;
              console.error('Cloudinary upload error details:', {
                error,
                errorType: typeof error,
                errorString: String(error),
                errorMessage: errorObj?.message || String(error),
                errorHttpCode: errorObj?.http_code,
                filename,
                fileSize: file.size,
                fileType: file.type,
                hasCredentials: {
                  cloudName: !!cloudName,
                  apiKey: !!apiKey,
                  apiSecret: !!apiSecret,
                },
              });
              reject(error);
            } else if (result && typeof result === 'object' && result !== null && 'public_id' in result) {
              resolve(result as CloudinaryUploadResult);
            } else {
              console.error('Cloudinary upload returned invalid result:', {
                result,
                resultType: typeof result,
                filename,
              });
              reject(new Error('Upload failed - no result from Cloudinary'));
            }
          }
        ).end(buffer);
      } catch (streamError) {
        console.error('Error creating upload stream:', streamError);
        reject(streamError);
      }
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
    // Enhanced error logging
    console.error('Error uploading image to Cloudinary:', {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      hasCredentials: {
        cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: !!process.env.CLOUDINARY_API_KEY,
        apiSecret: !!process.env.CLOUDINARY_API_SECRET,
      },
    });

    let errorMessage = 'Failed to upload image to Cloudinary';
    let errorCode = 'UPLOAD_FAILED';
    let errorDetails = 'An unexpected error occurred during upload.';
    
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      // Check for specific error types
      if (errorMsg.includes('invalid api key') || errorMsg.includes('unauthorized')) {
        errorMessage = 'Cloudinary API key is invalid. Please check your API key in environment variables.';
        errorCode = 'INVALID_API_KEY';
        errorDetails = 'The CLOUDINARY_API_KEY environment variable may be incorrect or missing.';
      } else if (errorMsg.includes('invalid api secret')) {
        errorMessage = 'Cloudinary API secret is invalid. Please check your API secret in environment variables.';
        errorCode = 'INVALID_API_SECRET';
        errorDetails = 'The CLOUDINARY_API_SECRET environment variable may be incorrect or missing.';
      } else if (errorMsg.includes('cloud name') || errorMsg.includes('not found')) {
        errorMessage = 'Cloudinary cloud name is invalid. Please check your cloud name in environment variables.';
        errorCode = 'INVALID_CLOUD_NAME';
        errorDetails = 'The CLOUDINARY_CLOUD_NAME environment variable may be incorrect or missing.';
      } else if (errorMsg.includes('network') || errorMsg.includes('timeout') || errorMsg.includes('econnrefused')) {
        errorMessage = 'Network error connecting to Cloudinary. Please check your internet connection and try again.';
        errorCode = 'NETWORK_ERROR';
        errorDetails = 'Cannot reach Cloudinary servers. This may be a temporary network issue.';
      } else if (errorMsg.includes('rate limit') || errorMsg.includes('quota')) {
        errorMessage = 'Cloudinary rate limit exceeded. Please try again later or upgrade your plan.';
        errorCode = 'RATE_LIMIT_EXCEEDED';
        errorDetails = 'You have exceeded your Cloudinary account limits. Check your dashboard for usage.';
      } else if (errorMsg.includes('file too large') || errorMsg.includes('size')) {
        errorMessage = 'File is too large for upload.';
        errorCode = 'FILE_TOO_LARGE';
        errorDetails = 'The file exceeds Cloudinary upload limits.';
      } else if (errorMsg.includes('upload failed')) {
        errorMessage = 'Cloudinary upload failed. Please check your credentials and try again.';
        errorCode = 'UPLOAD_FAILED';
        errorDetails = error.message;
      } else {
        errorMessage = error.message || errorMessage;
        errorDetails = error.message;
      }
    }

    // Extract more detailed error information for debugging
    const errorObj = error as CloudinaryError;
    const fullErrorDetails = {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorType: typeof error,
      errorCode,
      httpCode: errorObj?.http_code,
      cloudinaryError: errorObj?.error || errorObj?.err,
      rawError: errorObj,
    };

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: error instanceof Error ? error.message : String(error),
        errorCode,
        details: errorDetails,
        fullErrorDetails, // Include full error for debugging
        timestamp: new Date().toISOString(),
        troubleshooting: {
          step1: 'Verify your Cloudinary credentials are correctly set in your production environment variables',
          step2: 'Check that CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are all set',
          step3: 'Ensure credentials match your Cloudinary dashboard exactly (no extra spaces or quotes)',
          step4: 'Verify your Cloudinary account is active and not suspended',
          step5: 'Check Cloudinary status page: https://status.cloudinary.com',
          step6: 'Check Vercel function logs for detailed error information',
        },
      },
      { status: 500 }
    );
  }
}

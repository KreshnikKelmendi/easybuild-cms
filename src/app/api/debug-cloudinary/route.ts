import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Type for Cloudinary error objects
interface CloudinaryError {
  http_code?: number;
  name?: string;
  message?: string;
  error?: string;
  err?: string;
}

// Type for error details in response
interface ErrorDetails {
  http_code?: number;
  name?: string;
  message?: string;
  error?: string;
  raw?: string;
}

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Check if variables are set
    const configStatus = {
      cloudName: {
        set: !!cloudName,
        length: cloudName?.length || 0,
        isPlaceholder: cloudName?.includes('your_') || false,
        preview: cloudName ? `${cloudName.substring(0, 4)}...` : 'NOT SET',
      },
      apiKey: {
        set: !!apiKey,
        length: apiKey?.length || 0,
        isPlaceholder: apiKey?.includes('your_') || false,
        preview: apiKey ? `${apiKey.substring(0, 4)}...` : 'NOT SET',
      },
      apiSecret: {
        set: !!apiSecret,
        length: apiSecret?.length || 0,
        isPlaceholder: apiSecret?.includes('your_') || false,
        preview: apiSecret ? '***SET***' : 'NOT SET',
      },
    };

    // Test Cloudinary connection
    let connectionTest = null;
    let uploadTest = null;

    if (cloudName && apiKey && apiSecret && !cloudName.includes('your_') && !apiKey.includes('your_') && !apiSecret.includes('your_')) {
      try {
        // Test connection by trying to get usage details
        // This validates credentials are correct
        console.log('Testing Cloudinary connection...');
        const result = await cloudinary.api.usage();
        connectionTest = {
          success: true,
          message: 'Cloudinary connection successful',
          response: {
            plan: result.plan,
            credits: result.credits,
            // Don't expose sensitive info
          },
        };
      } catch (error) {
        // Log to console for server-side debugging
        console.error('Cloudinary connection test error:', error);
        
        // Extract detailed error information
        let errorMessage = 'Unknown error';
        let errorDetails: ErrorDetails | null = null;
        
        if (error instanceof Error) {
          errorMessage = error.message;
          errorDetails = {
            name: error.name,
            message: error.message,
          };
        } else if (error && typeof error === 'object') {
          // Handle Cloudinary error objects
          const cloudinaryError = error as CloudinaryError;
          errorMessage = cloudinaryError.message || 'Cloudinary API error';
          errorDetails = {
            http_code: cloudinaryError.http_code,
            name: cloudinaryError.name,
            message: cloudinaryError.message,
            error: cloudinaryError.error || cloudinaryError.err || undefined,
            raw: JSON.stringify(cloudinaryError, null, 2),
          };
        } else {
          errorMessage = String(error);
        }
        
        connectionTest = {
          success: false,
          message: 'Cloudinary connection failed',
          error: errorMessage,
          errorDetails,
          errorType: typeof error,
        };
      }

      // Try a small upload test (using a base64 encoded 1x1 pixel)
      try {
        console.log('Testing Cloudinary upload...');
        const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        const uploadResult = await cloudinary.uploader.upload(testImageBase64, {
          folder: 'easybuild-test',
          public_id: `test-${Date.now()}`,
        });

        console.log('Upload test successful:', uploadResult.public_id);
        uploadTest = {
          success: true,
          message: 'Test upload successful',
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        };
      } catch (error) {
        // Log to console for server-side debugging
        console.error('Cloudinary upload test error:', error);
        
        // Extract detailed error information
        let errorMessage = 'Unknown error';
        let errorDetails: ErrorDetails | null = null;
        
        if (error instanceof Error) {
          errorMessage = error.message;
          errorDetails = {
            name: error.name,
            message: error.message,
          };
        } else if (error && typeof error === 'object') {
          // Handle Cloudinary error objects
          const cloudinaryError = error as CloudinaryError;
          errorMessage = cloudinaryError.message || 'Cloudinary upload error';
          errorDetails = {
            http_code: cloudinaryError.http_code,
            name: cloudinaryError.name,
            message: cloudinaryError.message,
            error: cloudinaryError.error || cloudinaryError.err || undefined,
            raw: JSON.stringify(cloudinaryError, null, 2),
          };
        } else {
          errorMessage = String(error);
        }
        
        uploadTest = {
          success: false,
          message: 'Test upload failed',
          error: errorMessage,
          errorDetails,
          errorType: typeof error,
        };
      }
    } else {
      connectionTest = {
        success: false,
        message: 'Cannot test connection - credentials not properly configured',
      };
      uploadTest = {
        success: false,
        message: 'Cannot test upload - credentials not properly configured',
      };
    }

    const allConfigured = configStatus.cloudName.set && 
                          configStatus.apiKey.set && 
                          configStatus.apiSecret.set &&
                          !configStatus.cloudName.isPlaceholder &&
                          !configStatus.apiKey.isPlaceholder &&
                          !configStatus.apiSecret.isPlaceholder;

    return NextResponse.json({
      success: true,
      configuration: {
        status: allConfigured ? 'OK' : 'INCOMPLETE',
        allConfigured,
        variables: configStatus,
      },
      tests: {
        connection: connectionTest,
        upload: uploadTest,
      },
      recommendations: allConfigured
        ? connectionTest?.success && uploadTest?.success
          ? [
              '✅ All Cloudinary credentials are properly configured',
              '✅ Connection test passed',
              '✅ Upload test passed',
              'Your Cloudinary integration should be working correctly.',
            ]
          : [
              '⚠️ Credentials are set but tests failed',
              'Check the error messages above for details',
              'Verify your credentials in the Cloudinary dashboard',
              'Ensure your account is active and not suspended',
            ]
        : [
            '❌ Cloudinary credentials are missing or incomplete',
            'Set all three environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET',
            'Get your credentials from: https://cloudinary.com/console',
            'After setting variables, redeploy your application',
          ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug Cloudinary endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Debug endpoint failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

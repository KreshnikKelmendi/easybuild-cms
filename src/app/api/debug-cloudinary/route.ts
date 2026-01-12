import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

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
        // Test by trying to get account details
        const result = await cloudinary.api.ping();
        connectionTest = {
          success: true,
          message: 'Cloudinary connection successful',
          response: result,
        };
      } catch (error) {
        connectionTest = {
          success: false,
          message: 'Cloudinary connection failed',
          error: error instanceof Error ? error.message : String(error),
          errorType: typeof error,
        };
      }

      // Try a small upload test (using a base64 encoded 1x1 pixel)
      try {
        const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        const uploadResult = await cloudinary.uploader.upload(testImageBase64, {
          folder: 'easybuild-test',
          public_id: `test-${Date.now()}`,
        });

        uploadTest = {
          success: true,
          message: 'Test upload successful',
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        };
      } catch (error) {
        uploadTest = {
          success: false,
          message: 'Test upload failed',
          error: error instanceof Error ? error.message : String(error),
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

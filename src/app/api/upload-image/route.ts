import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

    // Validate file size (configurable limit)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '52428800'); // Default 50MB
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { success: false, message: `File size must be less than ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `banner-${timestamp}.${extension}`;
    
    // Try multiple upload locations for production compatibility
    let uploadSuccess = false;
    let filePath = '';
    let publicPath = '';

    // First try: public/assets directory
    try {
      const assetsDir = join(process.cwd(), 'public', 'assets');
      
      // Check if directory exists and is writable
      if (!existsSync(assetsDir)) {
        try {
          await mkdir(assetsDir, { recursive: true });
        } catch (mkdirError) {
          console.warn('Could not create public/assets directory:', mkdirError);
          throw new Error('Directory creation failed');
        }
      }

      // Test write permissions
      try {
        await access(assetsDir, 2); // Check write permission
      } catch (accessError) {
        console.warn('No write permission to public/assets directory:', accessError);
        throw new Error('No write permission');
      }

      filePath = join(assetsDir, filename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      uploadSuccess = true;
      publicPath = `/assets/${filename}`;
      
    } catch (firstError) {
      console.warn('First upload attempt failed:', firstError);
      
      // Second try: public/uploads directory
      try {
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        
        if (!existsSync(uploadsDir)) {
          try {
            await mkdir(uploadsDir, { recursive: true });
          } catch (mkdirError) {
            console.warn('Could not create public/uploads directory:', mkdirError);
            throw new Error('Uploads directory creation failed');
          }
        }

        filePath = join(uploadsDir, filename);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);
        
        uploadSuccess = true;
        publicPath = `/uploads/${filename}`;
        
      } catch (secondError) {
        console.warn('Second upload attempt failed:', secondError);
        
        // Third try: temp directory
        try {
          const tempDir = join(process.cwd(), 'tmp');
          
          if (!existsSync(tempDir)) {
            try {
              await mkdir(tempDir, { recursive: true });
            } catch (mkdirError) {
              console.warn('Could not create tmp directory:', mkdirError);
              throw new Error('Temp directory creation failed');
            }
          }

          filePath = join(tempDir, filename);
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          await writeFile(filePath, buffer);
          
          uploadSuccess = true;
          publicPath = `/tmp/${filename}`;
          
        } catch (thirdError) {
          console.error('All upload attempts failed:', thirdError);
          throw new Error('All upload locations are inaccessible');
        }
      }
    }

    if (!uploadSuccess) {
      throw new Error('Failed to upload file to any location');
    }

    console.log(`Image uploaded successfully to: ${filePath}`);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename,
        path: publicPath,
        size: file.size,
        type: file.type,
        uploadLocation: filePath
      }
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload image';
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        errorMessage = 'Server file system permission error';
      } else if (error.message.includes('directory')) {
        errorMessage = 'Server directory creation failed';
      } else if (error.message.includes('inaccessible')) {
        errorMessage = 'All upload locations are inaccessible';
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

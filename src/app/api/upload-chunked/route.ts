import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, rmdirSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    const fileName = formData.get('fileName') as string;
    const fileType = formData.get('fileType') as string;
    
    if (!chunk || !fileName) {
      return NextResponse.json(
        { success: false, message: 'Missing chunks or fileName' },
        { status: 400 }
      );
    }

    // Validate file size per chunk (Vercel limit: 4.5MB, so we use 4MB to be safe)
    const maxChunkSize = parseInt(process.env.MAX_CHUNK_SIZE || '4194304'); // Default 4MB for Vercel
    if (chunk.size > maxChunkSize) {
      const maxChunkSizeMB = Math.round(maxChunkSize / (1024 * 1024));
      return NextResponse.json(
        { success: false, message: `Chunk size must be less than ${maxChunkSizeMB}MB for Vercel compatibility` },
        { status: 400 }
      );
    }

    // Validate total file size (configurable limit)
    const totalFileSize = parseInt(formData.get('totalFileSize') as string) || 0;
    const maxTotalSize = parseInt(process.env.MAX_TOTAL_FILE_SIZE || '209715200'); // Default 200MB
    if (totalFileSize > maxTotalSize) {
      const maxTotalSizeMB = Math.round(maxTotalSize / (1024 * 1024));
      return NextResponse.json(
        { success: false, message: `Total file size must be less than ${maxTotalSizeMB}MB` },
        { status: 400 }
      );
    }

    // Create temp directory for chunks
    const tempDir = join(process.cwd(), 'tmp', 'chunks', fileName);
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Save chunk
    const chunkPath = join(tempDir, `chunk-${chunkIndex}`);
    const bytes = await chunk.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(chunkPath, buffer);

    // If this is the last chunk, combine all chunks
    if (chunkIndex === totalChunks - 1) {
      const finalPath = join(process.cwd(), 'public', 'uploads', fileName);
      const finalDir = join(process.cwd(), 'public', 'uploads');
      
      if (!existsSync(finalDir)) {
        await mkdir(finalDir, { recursive: true });
      }

      // Combine chunks (simplified - in production you'd want to stream this)
      const chunks: Buffer[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = join(tempDir, `chunk-${i}`);
        const chunkBuffer = readFileSync(chunkPath);
        chunks.push(chunkBuffer);
      }
      
      const finalBuffer = Buffer.concat(chunks);
      await writeFile(finalPath, finalBuffer);

      // Clean up chunks
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = join(tempDir, `chunk-${i}`);
        unlinkSync(chunkPath);
      }
      rmdirSync(tempDir);

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully via chunks',
        data: {
          fileName,
          path: `/uploads/${fileName}`,
          size: finalBuffer.length,
          chunks: totalChunks,
          method: 'chunked'
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded`,
      chunkIndex,
      totalChunks,
      progress: Math.round(((chunkIndex + 1) / totalChunks) * 100)
    });

  } catch (error) {
    console.error('Error uploading chunk:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload chunk',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, existsSync } from 'fs/promises';
import { join } from 'path';
import { existsSync as fsExistsSync } from 'fs';

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
        { success: false, message: 'Missing chunk or fileName' },
        { status: 400 }
      );
    }

    // Create temp directory for chunks
    const tempDir = join(process.cwd(), 'tmp', 'chunks', fileName);
    if (!fsExistsSync(tempDir)) {
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
      
      if (!fsExistsSync(finalDir)) {
        await mkdir(finalDir, { recursive: true });
      }

      // Combine chunks (simplified - in production you'd want to stream this)
      const chunks: Buffer[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = join(tempDir, `chunk-${i}`);
        const chunkBuffer = await import('fs').then(fs => fs.readFileSync(chunkPath));
        chunks.push(chunkBuffer);
      }
      
      const finalBuffer = Buffer.concat(chunks);
      await writeFile(finalPath, finalBuffer);

      // Clean up chunks
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = join(tempDir, `chunk-${i}`);
        await import('fs').then(fs => fs.unlinkSync(chunkPath));
      }
      await import('fs').then(fs => fs.rmdirSync(tempDir));

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          fileName,
          path: `/uploads/${fileName}`,
          size: finalBuffer.length
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded`,
      chunkIndex,
      totalChunks
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

export interface ChunkedUploadConfig {
  chunkSize?: number; // Default 4MB for Vercel compatibility
  maxRetries?: number;
  onProgress?: (progress: number) => void;
  onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
}

export interface ChunkedUploadResult {
  success: boolean;
  message: string;
  data?: {
    fileName: string;
    path: string;
    size: number;
    chunks: number;
    method: string;
  };
  error?: string;
}

export class ChunkedUploader {
  private config: Required<ChunkedUploadConfig>;
  private file: File;
  private chunks: Blob[];
  private totalChunks: number;

  constructor(file: File, config: ChunkedUploadConfig = {}) {
    this.file = file;
    this.config = {
      chunkSize: config.chunkSize || 4 * 1024 * 1024, // 4MB default for Vercel
      maxRetries: config.maxRetries || 3,
      onProgress: config.onProgress || (() => {}),
      onChunkComplete: config.onChunkComplete || (() => {})
    };

    // Split file into chunks
    this.chunks = this.splitFileIntoChunks();
    this.totalChunks = this.chunks.length;
  }

  private splitFileIntoChunks(): Blob[] {
    const chunks: Blob[] = [];
    let start = 0;

    while (start < this.file.size) {
      const end = Math.min(start + this.config.chunkSize, this.file.size);
      chunks.push(this.file.slice(start, end));
      start = end;
    }

    return chunks;
  }

  async upload(): Promise<ChunkedUploadResult> {
    try {
      // Upload each chunk
      for (let i = 0; i < this.chunks.length; i++) {
        const chunk = this.chunks[i];
        const success = await this.uploadChunk(chunk, i, this.totalChunks);
        
        if (!success) {
          throw new Error(`Failed to upload chunk ${i + 1}/${this.totalChunks}`);
        }

        // Update progress
        const progress = Math.round(((i + 1) / this.totalChunks) * 100);
        this.config.onProgress(progress);
        this.config.onChunkComplete(i, this.totalChunks);
      }

      return {
        success: true,
        message: `File uploaded successfully in ${this.totalChunks} chunks`,
        data: {
          fileName: this.file.name,
          path: `/uploads/${this.file.name}`,
          size: this.file.size,
          chunks: this.totalChunks,
          method: 'chunked'
        }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Chunked upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async uploadChunk(chunk: Blob, chunkIndex: number, totalChunks: number): Promise<boolean> {
    let retries = 0;

    while (retries < this.config.maxRetries) {
      try {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileName', this.file.name);
        formData.append('fileType', this.file.type);
        formData.append('totalFileSize', this.file.size.toString());

        const response = await fetch('/api/upload-chunked', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result.success;

      } catch (error) {
        retries++;
        console.warn(`Chunk ${chunkIndex + 1} upload failed, retry ${retries}/${this.config.maxRetries}:`, error);
        
        if (retries >= this.config.maxRetries) {
          console.error(`Chunk ${chunkIndex + 1} upload failed after ${retries} retries`);
          return false;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }

    return false;
  }

  // Helper method to check if file needs chunking
  static needsChunking(file: File, maxSize: number = 4.5 * 1024 * 1024): boolean {
    return file.size > maxSize;
  }

  // Helper method to get recommended chunk size for Vercel
  static getRecommendedChunkSize(): number {
    return 4 * 1024 * 1024; // 4MB for Vercel compatibility
  }
}

// Convenience function for simple chunked uploads
export async function uploadFileInChunks(
  file: File, 
  config?: ChunkedUploadConfig
): Promise<ChunkedUploadResult> {
  const uploader = new ChunkedUploader(file, config);
  return uploader.upload();
}

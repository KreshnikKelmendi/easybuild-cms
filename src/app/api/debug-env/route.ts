import { NextRequest, NextResponse } from 'next/server';
import { access, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const cwd = process.cwd();
    const env = process.env.NODE_ENV || 'unknown';
    
    // Test directory access
    const testDirs = [
      join(cwd, 'public'),
      join(cwd, 'public', 'assets'),
      join(cwd, 'public', 'uploads'),
      join(cwd, 'tmp')
    ];
    
    const dirTests = [];
    
    for (const dir of testDirs) {
      try {
        const exists = existsSync(dir);
        let writable = false;
        let readable = false;
        
        if (exists) {
          try {
            await access(dir, 2); // Check write permission
            writable = true;
          } catch {
            writable = false;
          }
          
          try {
            await access(dir, 4); // Check read permission
            readable = true;
          } catch {
            readable = false;
          }
        }
        
        dirTests.push({
          path: dir,
          exists,
          writable,
          readable,
          relative: dir.replace(cwd, '')
        });
      } catch (error) {
        dirTests.push({
          path: dir,
          exists: false,
          writable: false,
          readable: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Test file creation
    let fileTest = null;
    try {
      const testFile = join(cwd, 'tmp', 'test-write.txt');
      const testDir = join(cwd, 'tmp');
      
      if (!existsSync(testDir)) {
        await mkdir(testDir, { recursive: true });
      }
      
      await writeFile(testFile, 'test content');
      fileTest = {
        success: true,
        message: 'File write test passed',
        testFile: testFile.replace(cwd, '')
      };
    } catch (error) {
      fileTest = {
        success: false,
        message: 'File write test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    return NextResponse.json({
      success: true,
      environment: {
        nodeEnv: env,
        cwd: cwd,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      },
      directoryTests: dirTests,
      fileTest: fileTest,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Debug endpoint failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

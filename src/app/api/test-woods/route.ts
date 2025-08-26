import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wood from '@/models/Wood';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    // Test model creation
    const testWood = new Wood({
      title: {
        en: 'Test Wood',
        de: 'Test Holz',
        al: 'Test Druri',
      },
      imageUrl: '/test-image.png',
      order: 0,
    });
    
    // Test if model can be saved (without actually saving)
    const validationResult = testWood.validateSync();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection and model validation successful',
      validationResult,
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

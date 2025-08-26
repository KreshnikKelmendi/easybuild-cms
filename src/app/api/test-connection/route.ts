import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple test without MongoDB connection
    return NextResponse.json({ 
      success: true, 
      message: 'API is working correctly',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'API error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

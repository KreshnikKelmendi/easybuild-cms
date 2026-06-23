import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('MONGODB_DB_NAME:', process.env.MONGODB_DB_NAME || 'Not set');
    
    await connectDB();
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const reason =
      error && typeof error === 'object' && 'reason' in error
        ? (error as { reason?: unknown }).reason
        : undefined;

    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        reason: reason ? JSON.parse(JSON.stringify(reason)) : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

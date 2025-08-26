import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Environment variables check',
    hasMongoUri: !!process.env.MONGODB_URI,
    hasMongoDbName: !!process.env.MONGODB_DB_NAME,
    nodeEnv: process.env.NODE_ENV,
    // Don't expose the actual URI for security
  });
}

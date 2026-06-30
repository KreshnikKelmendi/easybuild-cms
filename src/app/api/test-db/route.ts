import { NextResponse } from 'next/server';
import connectDB, { isMongoNotPrimaryError, resetCachedConnection, withMongoWriteRetry } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await resetCachedConnection();
    await connectDB();

    const admin = mongoose.connection.db?.admin();
    const hello = admin ? await admin.command({ hello: 1 }) : null;

    let writeOk = false;
    let writeError: string | null = null;

    try {
      await withMongoWriteRetry(async () => {
        const db = mongoose.connection.db;
        if (!db) throw new Error('No database connection');

        const result = await db.collection('__connection_test__').insertOne({
          testedAt: new Date(),
        });
        await db.collection('__connection_test__').deleteOne({ _id: result.insertedId });
      });
      writeOk = true;
    } catch (error) {
      writeError = error instanceof Error ? error.message : 'Unknown write error';
    }

    return NextResponse.json({
      success: true,
      read: true,
      write: writeOk,
      writeError,
      isWritablePrimary: hello?.isWritablePrimary ?? null,
      secondary: hello?.secondary ?? null,
      hosts: hello?.hosts ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        notPrimary: isMongoNotPrimaryError(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

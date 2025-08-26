import mongoose from 'mongoose';

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'easybuild';

  // Debug logging
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hasMongoURI: !!MONGODB_URI,
    uriLength: MONGODB_URI?.length || 0,
    dbName: MONGODB_DB_NAME
  });

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing from environment variables');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local or production environment');
  }

  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', MONGODB_URI.substring(0, 50) + '...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    const mongooseInstance = await cached.promise;
    console.log('Successfully connected to MongoDB');
    cached.conn = mongooseInstance;
  } catch (e) {
    console.error('MongoDB connection error:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

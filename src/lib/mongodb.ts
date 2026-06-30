import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function cleanupUriParams(uri: string) {
  return uri
    .replace(/[&?]directConnection=(?:true|false)/gi, '')
    .replace(/\?&/g, '?')
    .replace(/&&+/g, '&')
    .replace(/[?&]$/, '');
}

/**
 * Atlas URLs copied as "direct connection" hit one shard (often secondary).
 * Reads work but writes fail with "not primary".
 */
function normalizeMongoUri(uri: string) {
  let normalized = uri.trim();

  normalized = cleanupUriParams(normalized);

  const atlasShardMatch = normalized.match(
    /@([a-z0-9-]+)-shard-00-00\.([a-z0-9]+\.mongodb\.net)/i
  );

  if (atlasShardMatch && !normalized.includes(',')) {
    const [, prefix, domain] = atlasShardMatch;
    const hosts = [0, 1, 2]
      .map((index) => `${prefix}-shard-00-0${index}.${domain}:27017`)
      .join(',');

    normalized = normalized.replace(
      new RegExp(`@${prefix}-shard-00-00\\.${domain.replace('.', '\\.')}:27017`, 'i'),
      `@${hosts}`
    );
  }

  normalized = normalized.replace(/[&?]readPreference=secondary[^&]*/gi, '');
  normalized = normalized.replace(/[&?]readPreference=secondaryPreferred[^&]*/gi, '');
  normalized = cleanupUriParams(normalized);

  const params: string[] = [];

  if (!/retryWrites=true/i.test(normalized)) {
    params.push('retryWrites=true');
  }
  if (!/w=majority/i.test(normalized)) {
    params.push('w=majority');
  }

  if (params.length === 0) {
    return normalized;
  }

  return `${normalized}${normalized.includes('?') ? '&' : '?'}${params.join('&')}`;
}

export async function resetCachedConnection() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch {
    // ignore disconnect errors during reset
  }

  cached.conn = null;
  cached.promise = null;
}

export function isMongoNotPrimaryError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as { code?: number; codeName?: string; message?: string };
  return (
    err.code === 10107 ||
    err.codeName === 'NotWritablePrimary' ||
    /not primary/i.test(err.message ?? '')
  );
}

export async function withMongoWriteRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      if (attempt > 0) {
        await resetCachedConnection();
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }

      await connectDB(true);
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isMongoNotPrimaryError(error) || attempt >= maxAttempts - 1) {
        throw error;
      }

      console.warn(`MongoDB write failed (not primary), retrying (${attempt + 1}/${maxAttempts - 1})...`);
    }
  }

  throw lastError;
}

async function connectDB(forceFresh = false) {
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'easybuild';

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing from environment variables');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local or production environment');
  }

  if (forceFresh) {
    await resetCachedConnection();
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const normalizedUri = normalizeMongoUri(MONGODB_URI);

    if (normalizedUri !== cleanupUriParams(MONGODB_URI.trim())) {
      console.info('MongoDB URI normalized for Atlas replica set (removed directConnection, expanded shard hosts).');
    }

    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(normalizedUri, opts);
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

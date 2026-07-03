import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis._mongooseCache ?? { conn: null, promise: null };
globalThis._mongooseCache = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  if (!MONGO_URI) throw new Error('MONGO_URI is not set');
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI, { bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

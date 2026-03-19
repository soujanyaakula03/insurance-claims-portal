import { createClient } from 'redis';
import { logger } from './utils/logger';

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

redisClient.on('error', (err) => logger.error({ err }, 'Redis client error'));

export const CACHE_TTL = 300; // 5 minutes

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redisClient.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttl = CACHE_TTL): Promise<void> {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch {
    // Non-fatal – log but continue
    logger.warn('Failed to set Redis cache');
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch {
    logger.warn('Failed to invalidate Redis cache');
  }
}

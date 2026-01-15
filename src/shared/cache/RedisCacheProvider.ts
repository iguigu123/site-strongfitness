import { Redis } from 'ioredis';
import { CacheProvider } from './CacheProvider';
import { env } from '@config/env';

export class RedisCacheProvider implements CacheProvider {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  async set(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    const data = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await this.client.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, data);
    }
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }
}


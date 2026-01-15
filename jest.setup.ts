import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { container } from 'tsyringe';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';
import type { CacheProvider } from '@shared/cache/CacheProvider';

dotenv.config({ path: '.env.test' });

class CacheProviderInMemory implements CacheProvider {
  private cache = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get(key);
    return (value as T) ?? null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    this.cache.set(key, value);
    if (ttlSeconds) {
      setTimeout(() => this.cache.delete(key), ttlSeconds * 1000);
    }
  }

  async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    Array.from(this.cache.keys())
      .filter(key => key.startsWith(prefix))
      .forEach(key => this.cache.delete(key));
  }
}

container.registerSingleton('UsersRepository', UsersRepositoryInMemory);
container.registerSingleton('ProductsRepository', ProductsRepositoryInMemory);
container.registerInstance('CacheProvider', new CacheProviderInMemory());

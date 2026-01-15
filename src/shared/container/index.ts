import { container } from 'tsyringe';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { UsersRepositoryPrisma } from '@modules/users/repositories/prisma/UsersRepositoryPrisma';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';

import { IProductsRepository } from '@modules/products/repositories/IProductsRepository';
import { ProductsRepositoryPrisma } from '@modules/products/repositories/prisma/ProductsRepositoryPrisma';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';

import { IUserTokensRepository } from '@modules/auth/repositories/IUserTokensRepository';
import { UserTokensRepositoryPrisma } from '@modules/auth/repositories/prisma/UserTokensRepositoryPrisma';
import { UserTokensRepositoryInMemory } from '@modules/auth/repositories/in-memory/UserTokensRepositoryInMemory';

import { CacheProvider } from '@shared/cache/CacheProvider';
import { RedisCacheProvider } from '@shared/cache/RedisCacheProvider';

if (process.env.NODE_ENV === 'test') {
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

  container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepositoryInMemory);
  container.registerSingleton<IProductsRepository>('ProductsRepository', ProductsRepositoryInMemory);
  container.registerSingleton<IUserTokensRepository>('UserTokensRepository', UserTokensRepositoryInMemory);
  container.registerInstance<CacheProvider>('CacheProvider', new CacheProviderInMemory());
} else {
  container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepositoryPrisma);
  container.registerSingleton<IProductsRepository>('ProductsRepository', ProductsRepositoryPrisma);
  container.registerSingleton<IUserTokensRepository>(
    'UserTokensRepository',
    UserTokensRepositoryPrisma
  );
  container.registerSingleton<CacheProvider>('CacheProvider', RedisCacheProvider);
}

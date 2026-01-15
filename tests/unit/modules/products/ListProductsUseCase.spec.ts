import 'reflect-metadata';
import { ListProductsUseCase } from '@modules/products/useCases/listProducts/ListProductsUseCase';
import { ProductsRepositoryInMemory } from '@modules/products/repositories/in-memory/ProductsRepositoryInMemory';
import { CacheProvider } from '@shared/cache/CacheProvider';

class CacheProviderInMemory implements CacheProvider {
  private cache = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get(key);
    return (value as T) ?? null;
  }

  async set(key: string, value: unknown): Promise<void> {
    this.cache.set(key, value);
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

let listProductsUseCase: ListProductsUseCase;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let cacheProviderInMemory: CacheProviderInMemory;

describe('List Products', () => {
  beforeEach(() => {
    productsRepositoryInMemory = new ProductsRepositoryInMemory();
    cacheProviderInMemory = new CacheProviderInMemory();
    listProductsUseCase = new ListProductsUseCase(
      productsRepositoryInMemory,
      cacheProviderInMemory
    );
  });

  it('should list products from repository when cache is empty', async () => {
    const products = await listProductsUseCase.execute();

    expect(products.length).toBeGreaterThan(0);
  });

  it('should cache products on first call and reuse cache on second call', async () => {
    const spyFindAll = jest.spyOn(productsRepositoryInMemory, 'findAll');

    const firstCall = await listProductsUseCase.execute();
    const secondCall = await listProductsUseCase.execute();

    expect(firstCall).toEqual(secondCall);
    expect(spyFindAll).toHaveBeenCalledTimes(1);
  });
});

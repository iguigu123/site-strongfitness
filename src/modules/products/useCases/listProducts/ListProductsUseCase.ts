import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '../../repositories/IProductsRepository';
import { CacheProvider } from '@shared/cache/CacheProvider';

@injectable()
class ListProductsUseCase {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CacheProvider')
    private cacheProvider: CacheProvider
  ) {}

  async execute() {
    const cacheKey = 'products:list';

    const cached = await this.cacheProvider.get<unknown[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const products = await this.productsRepository.findAll();

    await this.cacheProvider.set(cacheKey, products, 60);

    return products;
  }
}

export { ListProductsUseCase };

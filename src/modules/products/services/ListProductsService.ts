import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '../repositories/IProductsRepository';

@injectable()
export class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository
  ) {}

  async execute() {
    return this.productsRepository.findAll();
  }
}


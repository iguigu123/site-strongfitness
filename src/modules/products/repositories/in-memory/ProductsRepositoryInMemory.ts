import { ICreateProductDTO, IProductsRepository } from '../IProductsRepository';
import { Product } from '../../entities/Product';

class ProductsRepositoryInMemory implements IProductsRepository {
  private products: Product[] = [];

  constructor() {
    // Seed some initial products for the frontend
    this.products.push(
      Object.assign(new Product(), {
        name: 'Whey Protein Isolate',
        description: 'High quality whey protein',
        price: 49.99,
        image_url: 'https://placehold.co/600x400',
      }),
      Object.assign(new Product(), {
        name: 'Creatine Monohydrate',
        description: 'Pure creatine for muscle growth',
        price: 29.99,
        image_url: 'https://placehold.co/600x400',
      })
    );
  }

  async create({ name, description, price, image_url }: ICreateProductDTO): Promise<Product> {
    const product = new Product();
    Object.assign(product, { name, description, price, image_url });
    this.products.push(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  }
}

export { ProductsRepositoryInMemory };

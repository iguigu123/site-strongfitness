import { Product } from '../entities/Product';

export interface ICreateProductDTO {
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | undefined>;
}

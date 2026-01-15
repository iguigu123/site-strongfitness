import { prisma } from '@shared/infra/prisma/client';
import { Product } from '../../entities/Product';
import { ICreateProductDTO, IProductsRepository } from '../IProductsRepository';

class ProductsRepositoryPrisma implements IProductsRepository {
  async create({ name, description, price, image_url }: ICreateProductDTO): Promise<Product> {
    const created = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: 0,
        status: 'ACTIVE',
        image_url,
      },
    });

    const product = new Product();

    Object.assign(product, {
      id: created.id,
      name: created.name,
      description: created.description,
      price: created.price.toNumber(),
      stock: created.stock,
      status: created.status,
      image_url: created.image_url,
      created_at: created.created_at,
    });

    return product;
  }

  async findAll(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' },
    });

    return products.map((p: any) => {
      const product = new Product();

      Object.assign(product, {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price.toNumber(),
        stock: p.stock,
        status: p.status,
        image_url: p.image_url,
        created_at: p.created_at,
      });

      return product;
    });
  }

  async findById(id: string): Promise<Product | undefined> {
    const found = await prisma.product.findUnique({
      where: { id },
    });

    if (!found) {
      return undefined;
    }

    const product = new Product();

    Object.assign(product, {
      id: found.id,
      name: found.name,
      description: found.description,
      price: found.price.toNumber(),
      stock: found.stock,
      status: found.status,
      image_url: found.image_url,
      created_at: found.created_at,
    });

    return product;
  }
}

export { ProductsRepositoryPrisma };

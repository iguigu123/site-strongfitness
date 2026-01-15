"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepositoryPrisma = void 0;
const client_1 = require("@shared/infra/prisma/client");
const Product_1 = require("../../entities/Product");
class ProductsRepositoryPrisma {
    async create({ name, description, price, image_url }) {
        const created = await client_1.prisma.product.create({
            data: {
                name,
                description,
                price,
                stock: 0,
                status: 'ACTIVE',
                image_url,
            },
        });
        const product = new Product_1.Product();
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
    async findAll() {
        const products = await client_1.prisma.product.findMany({
            orderBy: { created_at: 'desc' },
        });
        return products.map((p) => {
            const product = new Product_1.Product();
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
    async findById(id) {
        const found = await client_1.prisma.product.findUnique({
            where: { id },
        });
        if (!found) {
            return undefined;
        }
        const product = new Product_1.Product();
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
exports.ProductsRepositoryPrisma = ProductsRepositoryPrisma;

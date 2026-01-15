"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepositoryInMemory = void 0;
const Product_1 = require("../../entities/Product");
class ProductsRepositoryInMemory {
    constructor() {
        this.products = [];
        this.products.push(Object.assign(new Product_1.Product(), {
            name: 'Whey Protein Isolate',
            description: 'High quality whey protein',
            price: 49.99,
            image_url: 'https://placehold.co/600x400',
        }), Object.assign(new Product_1.Product(), {
            name: 'Creatine Monohydrate',
            description: 'Pure creatine for muscle growth',
            price: 29.99,
            image_url: 'https://placehold.co/600x400',
        }));
    }
    async create({ name, description, price, image_url }) {
        const product = new Product_1.Product();
        Object.assign(product, { name, description, price, image_url });
        this.products.push(product);
        return product;
    }
    async findAll() {
        return this.products;
    }
    async findById(id) {
        return this.products.find(product => product.id === id);
    }
}
exports.ProductsRepositoryInMemory = ProductsRepositoryInMemory;

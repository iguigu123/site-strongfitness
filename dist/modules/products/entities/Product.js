"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const uuid_1 = require("uuid");
class Product {
    constructor() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
        this.stock = 0;
        this.status = 'ACTIVE';
        this.created_at = new Date();
    }
}
exports.Product = Product;

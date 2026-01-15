"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProductsController = void 0;
const tsyringe_1 = require("tsyringe");
const ListProductsService_1 = require("../services/ListProductsService");
const response_1 = require("@shared/http/response");
class ListProductsController {
    async handle(request, response) {
        const listProductsService = tsyringe_1.container.resolve(ListProductsService_1.ListProductsService);
        const products = await listProductsService.execute();
        return (0, response_1.successResponse)(response, products, 'Products list');
    }
}
exports.ListProductsController = ListProductsController;

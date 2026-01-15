"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProductsController = void 0;
const tsyringe_1 = require("tsyringe");
const ListProductsUseCase_1 = require("./ListProductsUseCase");
class ListProductsController {
    async handle(request, response) {
        const listProductsUseCase = tsyringe_1.container.resolve(ListProductsUseCase_1.ListProductsUseCase);
        const products = await listProductsUseCase.execute();
        return response.json(products);
    }
}
exports.ListProductsController = ListProductsController;

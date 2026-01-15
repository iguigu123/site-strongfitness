"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const express_1 = require("express");
const ListProductsController_1 = require("./ListProductsController");
const productsRoutes = (0, express_1.Router)();
exports.productsRoutes = productsRoutes;
const listProductsController = new ListProductsController_1.ListProductsController();
productsRoutes.get('/', listProductsController.handle);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authenticate_routes_1 = require("@modules/auth/controllers/authenticate.routes");
const users_routes_1 = require("@modules/users/controllers/users.routes");
const products_routes_1 = require("@modules/products/controllers/products.routes");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/health', (request, response) => {
    return response.json({ status: 'ok', timestamp: new Date() });
});
router.use('/auth', authenticate_routes_1.authenticateRoutes);
router.use('/users', users_routes_1.usersRoutes);
router.use('/products', products_routes_1.productsRoutes);

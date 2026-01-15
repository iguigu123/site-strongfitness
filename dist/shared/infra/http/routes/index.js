"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authenticate_routes_1 = require("@modules/auth/infra/http/routes/authenticate.routes");
const users_routes_1 = require("@modules/users/infra/http/routes/users.routes");
const products_routes_1 = require("@modules/products/infra/http/routes/products.routes");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
router.use('/auth', authenticate_routes_1.authenticateRoutes);
router.use('/users', users_routes_1.usersRoutes);
router.use('/products', products_routes_1.productsRoutes);

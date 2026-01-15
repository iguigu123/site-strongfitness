"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = void 0;
const env_1 = require("./env");
exports.serverConfig = {
    port: env_1.env.PORT,
    apiPrefix: '/api',
};

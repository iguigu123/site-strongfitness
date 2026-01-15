"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const AppError_1 = require("@shared/errors/AppError");
const response_1 = require("@shared/http/response");
const env_1 = require("@config/env");
require("@shared/container");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);
app.use(express_1.default.json());
const staticPath = path_1.default.join(__dirname, '../../../../../');
app.use(express_1.default.static(staticPath));
app.use('/api', routes_1.router);
app.use((err, request, response, next) => {
    if (err instanceof AppError_1.AppError) {
        return (0, response_1.errorResponse)(response, err.message, err.statusCode);
    }
    console.error(err);
    return (0, response_1.errorResponse)(response, 'Internal server error', 500);
});
const PORT = env_1.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Docs: http://localhost:${PORT}/api-docs (ToDo)`);
});

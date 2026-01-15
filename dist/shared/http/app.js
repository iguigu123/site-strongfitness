"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
require("@shared/container");
const routes_1 = require("./routes");
const AppError_1 = require("@shared/errors/AppError");
const response_1 = require("./response");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
const staticPath = path_1.default.resolve(process.cwd());
app.use(express_1.default.static(staticPath));
app.use('/api', routes_1.router);
app.use((err, request, response, _) => {
    if (err instanceof AppError_1.AppError) {
        return (0, response_1.errorResponse)(response, err.message, err.statusCode);
    }
    console.error(err);
    return (0, response_1.errorResponse)(response, 'Internal server error', 500);
});

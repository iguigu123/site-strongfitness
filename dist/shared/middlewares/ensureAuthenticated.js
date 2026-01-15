"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = require("@shared/errors/AppError");
const auth_1 = __importDefault(require("@config/auth"));
function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.AppError('Token missing', 401);
    }
    const [, token] = authHeader.split(' ');
    try {
        const { sub: user_id } = (0, jsonwebtoken_1.verify)(token, auth_1.default.jwt.secret);
        Object.assign(request, {
            user: {
                id: user_id,
            },
        });
        return next();
    }
    catch {
        throw new AppError_1.AppError('Invalid token', 401);
    }
}

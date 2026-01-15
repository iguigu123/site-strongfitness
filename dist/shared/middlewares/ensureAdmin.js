"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAdmin = ensureAdmin;
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("@shared/errors/AppError");
async function ensureAdmin(request, response, next) {
    const { id } = request.user;
    const usersRepository = tsyringe_1.container.resolve('UsersRepository');
    const user = await usersRepository.findById(id);
    if (!user) {
        throw new AppError_1.AppError('User not found', 401);
    }
    if (user.role !== 'ADMIN') {
        throw new AppError_1.AppError('User is not an administrator', 403);
    }
    return next();
}

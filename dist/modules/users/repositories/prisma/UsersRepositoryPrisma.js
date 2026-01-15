"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepositoryPrisma = void 0;
const client_1 = require("@shared/infra/prisma/client");
const User_1 = require("../../entities/User");
class UsersRepositoryPrisma {
    async create({ name, email, password_hash, isAdmin, role }) {
        const created = await client_1.prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                role: role ?? 'USER',
            },
        });
        const user = new User_1.User();
        Object.assign(user, {
            id: created.id,
            name: created.name,
            email: created.email,
            password_hash: created.password_hash,
            isAdmin: created.role === 'ADMIN',
            role: created.role,
            created_at: created.created_at,
        });
        return user;
    }
    async findByEmail(email) {
        const found = await client_1.prisma.user.findUnique({
            where: { email },
        });
        if (!found) {
            return undefined;
        }
        const user = new User_1.User();
        Object.assign(user, {
            id: found.id,
            name: found.name,
            email: found.email,
            password_hash: found.password_hash,
            isAdmin: found.role === 'ADMIN',
            role: found.role,
            created_at: found.created_at,
        });
        return user;
    }
    async findById(id) {
        const found = await client_1.prisma.user.findUnique({
            where: { id },
        });
        if (!found) {
            return undefined;
        }
        const user = new User_1.User();
        Object.assign(user, {
            id: found.id,
            name: found.name,
            email: found.email,
            password_hash: found.password_hash,
            isAdmin: found.role === 'ADMIN',
            role: found.role,
            created_at: found.created_at,
        });
        return user;
    }
}
exports.UsersRepositoryPrisma = UsersRepositoryPrisma;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokensRepositoryPrisma = void 0;
const client_1 = require("@shared/infra/prisma/client");
const UserToken_1 = require("../../entities/UserToken");
class UserTokensRepositoryPrisma {
    async create({ user_id, expires_date, refresh_token }) {
        const created = await client_1.prisma.refreshToken.create({
            data: {
                user_id,
                token: refresh_token,
                expires_at: expires_date,
            },
        });
        const userToken = new UserToken_1.UserToken();
        Object.assign(userToken, {
            id: created.id,
            refresh_token: created.token,
            user_id: created.user_id,
            expires_date: created.expires_at,
            created_at: created.created_at,
        });
        return userToken;
    }
    async findByUserIdAndRefreshToken(user_id, refresh_token) {
        const found = await client_1.prisma.refreshToken.findFirst({
            where: {
                user_id,
                token: refresh_token,
            },
        });
        if (!found) {
            return undefined;
        }
        const userToken = new UserToken_1.UserToken();
        Object.assign(userToken, {
            id: found.id,
            refresh_token: found.token,
            user_id: found.user_id,
            expires_date: found.expires_at,
            created_at: found.created_at,
        });
        return userToken;
    }
    async findByRefreshToken(refresh_token) {
        const found = await client_1.prisma.refreshToken.findUnique({
            where: { token: refresh_token },
        });
        if (!found) {
            return undefined;
        }
        const userToken = new UserToken_1.UserToken();
        Object.assign(userToken, {
            id: found.id,
            refresh_token: found.token,
            user_id: found.user_id,
            expires_date: found.expires_at,
            created_at: found.created_at,
        });
        return userToken;
    }
    async deleteById(id) {
        await client_1.prisma.refreshToken.delete({
            where: { id },
        });
    }
}
exports.UserTokensRepositoryPrisma = UserTokensRepositoryPrisma;

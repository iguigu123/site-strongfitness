"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokensRepositoryInMemory = void 0;
const UserToken_1 = require("../../entities/UserToken");
class UserTokensRepositoryInMemory {
    constructor() {
        this.userTokens = [];
    }
    async create({ user_id, expires_date, refresh_token }) {
        const userToken = new UserToken_1.UserToken();
        Object.assign(userToken, {
            expires_date,
            refresh_token,
            user_id,
        });
        this.userTokens.push(userToken);
        return userToken;
    }
    async findByUserIdAndRefreshToken(user_id, refresh_token) {
        return this.userTokens.find((token) => token.user_id === user_id && token.refresh_token === refresh_token);
    }
    async findByRefreshToken(refresh_token) {
        return this.userTokens.find((token) => token.refresh_token === refresh_token);
    }
    async deleteById(id) {
        const index = this.userTokens.findIndex((token) => token.id === id);
        if (index !== -1) {
            this.userTokens.splice(index, 1);
        }
    }
}
exports.UserTokensRepositoryInMemory = UserTokensRepositoryInMemory;

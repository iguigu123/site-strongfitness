"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
exports.default = {
    jwt: {
        secret: env_1.env.APP_SECRET,
        expiresIn: env_1.env.JWT_EXPIRES_IN,
        refreshTokenExpiresIn: env_1.env.REFRESH_TOKEN_EXPIRES_IN,
        refreshTokenExpiresInDays: env_1.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
    },
};

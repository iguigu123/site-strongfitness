"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(3333),
    APP_SECRET: zod_1.z.string().min(10),
    APP_API_URL: zod_1.z.string().url().optional(),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_HOST: zod_1.z.string().default('127.0.0.1'),
    REDIS_PORT: zod_1.z.coerce.number().default(6379),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default('7d'),
    REFRESH_TOKEN_EXPIRES_IN_DAYS: zod_1.z.coerce.number().default(7),
    CORS_ORIGIN: zod_1.z.string().default('*'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('Invalid environment variables', _env.error.format());
    throw new Error('Invalid environment variables');
}
exports.env = _env.data;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheProvider = void 0;
const ioredis_1 = require("ioredis");
const env_1 = require("@config/env");
class RedisCacheProvider {
    constructor() {
        this.client = new ioredis_1.Redis({
            host: env_1.env.REDIS_HOST,
            port: env_1.env.REDIS_PORT,
            password: env_1.env.REDIS_PASSWORD,
        });
    }
    async get(key) {
        const data = await this.client.get(key);
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }
    async set(key, value, ttlSeconds = 60) {
        const data = JSON.stringify(value);
        if (ttlSeconds > 0) {
            await this.client.set(key, data, 'EX', ttlSeconds);
        }
        else {
            await this.client.set(key, data);
        }
    }
    async invalidate(key) {
        await this.client.del(key);
    }
    async invalidatePrefix(prefix) {
        const keys = await this.client.keys(`${prefix}:*`);
        if (keys.length > 0) {
            await this.client.del(keys);
        }
    }
}
exports.RedisCacheProvider = RedisCacheProvider;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQueue = exports.ORDER_QUEUE_NAME = void 0;
const bullmq_1 = require("bullmq");
const env_1 = require("@config/env");
exports.ORDER_QUEUE_NAME = 'orders:process';
const connection = {
    host: env_1.env.REDIS_HOST,
    port: env_1.env.REDIS_PORT,
    password: env_1.env.REDIS_PASSWORD,
};
exports.orderQueue = new bullmq_1.Queue(exports.ORDER_QUEUE_NAME, {
    connection,
});

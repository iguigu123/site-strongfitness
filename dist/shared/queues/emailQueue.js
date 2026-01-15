"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = exports.EMAIL_QUEUE_NAME = void 0;
const bullmq_1 = require("bullmq");
const env_1 = require("@config/env");
exports.EMAIL_QUEUE_NAME = 'emails:send';
const connection = {
    host: env_1.env.REDIS_HOST,
    port: env_1.env.REDIS_PORT,
    password: env_1.env.REDIS_PASSWORD,
};
exports.emailQueue = new bullmq_1.Queue(exports.EMAIL_QUEUE_NAME, {
    connection,
});

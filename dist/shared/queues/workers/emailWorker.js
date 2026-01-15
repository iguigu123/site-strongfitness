"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = void 0;
const bullmq_1 = require("bullmq");
const env_1 = require("@config/env");
const emailQueue_1 = require("../emailQueue");
const connection = {
    host: env_1.env.REDIS_HOST,
    port: env_1.env.REDIS_PORT,
    password: env_1.env.REDIS_PASSWORD,
};
exports.emailWorker = new bullmq_1.Worker(emailQueue_1.EMAIL_QUEUE_NAME, async (job) => {
    const { to, subject, body } = job.data;
    console.log(`Sending email to ${to}: ${subject} - ${body}`);
}, {
    connection,
});
exports.emailWorker.on('failed', (job, err) => {
    console.error(`Email job ${job?.id} failed`, err);
});
exports.emailWorker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed`);
});

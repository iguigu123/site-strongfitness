"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderWorker = void 0;
const bullmq_1 = require("bullmq");
const env_1 = require("@config/env");
const orderQueue_1 = require("../orderQueue");
const client_1 = require("@shared/infra/prisma/client");
const connection = {
    host: env_1.env.REDIS_HOST,
    port: env_1.env.REDIS_PORT,
    password: env_1.env.REDIS_PASSWORD,
};
exports.orderWorker = new bullmq_1.Worker(orderQueue_1.ORDER_QUEUE_NAME, async (job) => {
    const { orderId } = job.data;
    const order = await client_1.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }
    const total = order.items.reduce((acc, item) => {
        return acc + item.price.toNumber() * item.quantity;
    }, 0);
    await client_1.prisma.order.update({
        where: { id: orderId },
        data: {
            total,
            status: 'PROCESSED',
        },
    });
    console.log(`Order ${orderId} processed with total ${total}`);
}, {
    connection,
});
exports.orderWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});
exports.orderWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

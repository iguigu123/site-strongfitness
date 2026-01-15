import { Worker, Job } from 'bullmq';
import { env } from '@config/env';
import { ORDER_QUEUE_NAME } from '../orderQueue';
import { prisma } from '@shared/infra/prisma/client';

export interface OrderJobData {
  orderId: string;
}

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
};

export const orderWorker = new Worker<OrderJobData>(
  ORDER_QUEUE_NAME,
  async (job: Job<OrderJobData>) => {
    const { orderId } = job.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const total = order.items.reduce((acc, item) => {
      return acc + item.price.toNumber() * item.quantity;
    }, 0);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        total,
        status: 'PROCESSED',
      },
    });

    console.warn(`Order ${orderId} processed with total ${total}`);
  },
  {
    connection,
  }
);

orderWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});

orderWorker.on('completed', (job) => {
  console.warn(`Job ${job.id} completed`);
});

import { Queue } from 'bullmq';
import { env } from '@config/env';

export const ORDER_QUEUE_NAME = 'orders:process';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
};

export const orderQueue = new Queue(ORDER_QUEUE_NAME, {
  connection,
});


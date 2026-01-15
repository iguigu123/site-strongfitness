import { Queue } from 'bullmq';
import { env } from '@config/env';

export const EMAIL_QUEUE_NAME = 'emails:send';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
};

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection,
});


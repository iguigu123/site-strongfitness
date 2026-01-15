import { Worker, Job } from 'bullmq';
import { env } from '@config/env';
import { EMAIL_QUEUE_NAME } from '../emailQueue';

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
};

export const emailWorker = new Worker<EmailJobData>(
  EMAIL_QUEUE_NAME,
  async (job: Job<EmailJobData>) => {
    const { to, subject, body } = job.data;

    // Simulação de envio de e-mail
    console.warn(`Sending email to ${to}: ${subject} - ${body}`);
  },
  {
    connection,
  }
);

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed`, err);
});

emailWorker.on('completed', (job) => {
  console.warn(`Email job ${job.id} completed`);
});

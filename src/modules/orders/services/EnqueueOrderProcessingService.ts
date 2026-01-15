import { injectable } from 'tsyringe';
import { orderQueue } from '@shared/queues/orderQueue';

interface Request {
  orderId: string;
}

@injectable()
export class EnqueueOrderProcessingService {
  async execute({ orderId }: Request): Promise<void> {
    await orderQueue.add('process', { orderId }, { attempts: 3, backoff: 5000 });
  }
}


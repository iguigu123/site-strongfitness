import 'reflect-metadata';
import { EnqueueOrderProcessingService } from '@modules/orders/services/EnqueueOrderProcessingService';
import { orderQueue } from '@shared/queues/orderQueue';

jest.mock('@shared/queues/orderQueue', () => {
  return {
    orderQueue: {
      add: jest.fn(),
    },
  };
});

describe('Enqueue Order Processing', () => {
  it('should enqueue an order to be processed', async () => {
    const service = new EnqueueOrderProcessingService();

    await service.execute({ orderId: 'order-123' });

    expect(orderQueue.add).toHaveBeenCalledWith(
      'process',
      { orderId: 'order-123' },
      { attempts: 3, backoff: 5000 }
    );
  });
});

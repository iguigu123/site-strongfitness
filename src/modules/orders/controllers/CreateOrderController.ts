import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { EnqueueOrderProcessingService } from '@modules/orders/services/EnqueueOrderProcessingService';

export class CreateOrderController {
  async handle(request: Request, response: Response): Promise<Response> {
    const schema = z.object({
      items: z
        .array(
          z.object({
            productId: z.string().min(1),
            quantity: z.number().int().positive(),
          })
        )
        .min(1),
    });

    const { items } = schema.parse(request.body);

    const orderId = uuidv4();

    const enqueueService = container.resolve(EnqueueOrderProcessingService);
    await enqueueService.execute({ orderId });

    return response.status(202).json({
      orderId,
      status: 'QUEUED',
      itemsCount: items.length,
    });
  }
}


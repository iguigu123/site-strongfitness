import 'reflect-metadata';
import request from 'supertest';
import { app } from '@shared/infra/http/server';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

jest.mock('@shared/queues/orderQueue', () => {
  return {
    orderQueue: {
      add: jest.fn(),
    },
  };
});

describe('Orders - Create', () => {
  it('should create an order and enqueue for processing', async () => {
    const token = sign({}, authConfig.jwt.secret as string, {
      subject: 'user-id',
      expiresIn: '15m',
    });

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { productId: 'p1', quantity: 2 },
          { productId: 'p2', quantity: 1 },
        ],
      });

    expect(response.status).toBe(202);
    expect(response.body.orderId).toBeDefined();
    expect(response.body.status).toBe('QUEUED');
    expect(response.body.itemsCount).toBe(2);
  });

  it('should reject unauthenticated requests', async () => {
    const response = await request(app).post('/api/orders').send({
      items: [{ productId: 'p1', quantity: 1 }],
    });
    expect(response.status).toBe(401);
  });

  it('should validate items payload', async () => {
    const token = sign({}, authConfig.jwt.secret as string, {
      subject: 'user-id',
      expiresIn: '15m',
    });

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [],
      });

    expect(response.status).toBe(400);
  });
});


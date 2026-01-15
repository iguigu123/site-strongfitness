import 'reflect-metadata';
import request from 'supertest';
import { app } from '@shared/infra/http/server';

describe('Products - List', () => {
  it('should list products', async () => {
    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

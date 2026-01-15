import 'reflect-metadata';
import request from 'supertest';
import { app } from '@shared/infra/http/server';

describe('API Integration', () => {
  it('health route should respond with status ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});

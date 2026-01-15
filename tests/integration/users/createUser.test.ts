import 'reflect-metadata';
import request from 'supertest';
import { app } from '@shared/infra/http/server';

describe('Users - Create', () => {
  it('should create a user and return 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Integration User',
        email: 'integration.user@example.com',
        password: 'strong-password',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('integration.user@example.com');
  });
});

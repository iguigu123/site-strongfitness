import 'reflect-metadata';
import request from 'supertest';
import { app } from '@shared/infra/http/server';

describe('Auth - Login', () => {
  it('should authenticate and return JWT token', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'Login User',
        email: 'login.user@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/auth/sessions')
      .send({
        email: 'login.user@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.user.email).toBe('login.user@example.com');
  });
});

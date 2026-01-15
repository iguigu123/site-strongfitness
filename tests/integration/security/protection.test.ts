import 'reflect-metadata';
import express from 'express';
import request from 'supertest';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
import { ensureAdmin } from '@shared/middlewares/ensureAdmin';
import authConfig from '@config/auth';
import { sign } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';

describe('Security - Route Protection', () => {
  it('should block access without JWT', async () => {
    const app = express();
    app.get('/protected', ensureAuthenticated, (req, res) => res.json({ ok: true }));

    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
  });

  it('should allow access with valid JWT', async () => {
    const usersRepo = new UsersRepositoryInMemory();
    const user = await usersRepo.create({
      name: 'Protected User',
      email: 'protected@example.com',
      password_hash: 'hash',
    });

    const token = sign({}, authConfig.jwt.secret as any, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn as any,
    } as any);

    const app = express();
    app.get('/protected', ensureAuthenticated, (req, res) => res.json({ ok: true }));
    const response = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('should block access with invalid JWT', async () => {
    const app = express();
    app.get('/protected', ensureAuthenticated, (req, res) => res.json({ ok: true }));
    const response = await request(app).get('/protected').set('Authorization', 'Bearer invalid');
    expect(response.status).toBe(401);
  });

  it('should block access with expired JWT', async () => {
    const usersRepo = new UsersRepositoryInMemory();
    const user = await usersRepo.create({
      name: 'Expired User',
      email: 'expired@example.com',
      password_hash: 'hash',
    });

    const token = sign({}, authConfig.jwt.secret as any, {
      subject: user.id,
      expiresIn: '1ms' as any,
    } as any);

    const app = express();
    app.get('/protected', ensureAuthenticated, (req, res) => res.json({ ok: true }));

    await new Promise(resolve => setTimeout(resolve, 10));

    const response = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(401);
  });

  it('should enforce admin role', async () => {
    container.registerSingleton('UsersRepository', UsersRepositoryInMemory);
    const usersRepo = container.resolve<UsersRepositoryInMemory>('UsersRepository');
    const user = await usersRepo.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: 'hash',
    });
    user.role = 'ADMIN';

    const token = sign({}, authConfig.jwt.secret as any, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn as any,
    } as any);

    const app = express();
    app.get('/admin', ensureAuthenticated, ensureAdmin, (req, res) => res.json({ ok: true }));
    const response = await request(app).get('/admin').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});

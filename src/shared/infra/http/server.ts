import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import Redis from 'ioredis';

import { router } from './routes';
import { AppError } from '@shared/errors/AppError';
import { errorResponse } from '@shared/http/response';
import { env } from '@config/env';
import { swaggerSpec } from './docs/openapi';
import '@shared/container';
import { logger } from '@shared/logger';
import { metrics } from '@shared/observability/metrics';
import { prisma } from '@shared/infra/prisma/client';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: env.CORS_ORIGIN,
}));

app.use(compression());
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/api', limiter);

app.use(express.json());

const staticPath = path.join(__dirname, '../../../../../'); 
app.use(express.static(staticPath));

app.use((req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - started;
    metrics.record(req.path, req.method, res.statusCode, duration);
    logger.info('http_request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
    });
  });
  next();
});

app.get('/api/metrics', (req, res) => {
  return res.json(metrics.snapshot());
});

app.get('/api/ready', async (req, res) => {
  let dbOk = false;
  let redisOk = false;
  try {
    await prisma.$connect();
    dbOk = true;
  } catch {
    dbOk = false;
  }
  try {
    const client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      lazyConnect: true,
    });
    await client.connect();
    await client.ping();
    await client.quit();
    redisOk = true;
  } catch {
    redisOk = false;
  }
  const ready = dbOk && redisOk;
  return res.status(ready ? 200 : 503).json({ ready, checks: { dbOk, redisOk } });
});

app.use('/api', router);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return errorResponse(response, err.message, err.statusCode);
  }

  if (env.NODE_ENV === 'development') {
    logger.error('error', { message: err.message, stack: (err as any).stack });
  } else {
    logger.error('error', { message: err.message });
  }

  return errorResponse(response, 'Internal server error', 500);
});

const PORT = env.PORT;

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    logger.info('server_started', { port: PORT });
  });
  server.setTimeout(30_000);
  const shutdown = () => {
    server.close(async () => {
      try {
        await prisma.$disconnect();
      } catch {}
      logger.info('server_stopped');
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

export { app };

import 'reflect-metadata';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';

import '@shared/container';
import { router } from './routes';
import { AppError } from '@shared/errors/AppError';
import { errorResponse } from './response';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

const staticPath = path.resolve(process.cwd());
app.use(express.static(staticPath));

app.use('/api', router);

app.use(
  (err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      return errorResponse(response, err.message, err.statusCode);
    }

    console.error(err);

    return errorResponse(response, 'Internal server error', 500);
  }
);

export { app };


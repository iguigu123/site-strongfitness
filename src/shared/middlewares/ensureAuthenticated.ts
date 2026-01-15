import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '@shared/errors/AppError';
import authConfig from '@config/auth';

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(
      token,
      authConfig.jwt.secret as string
    ) as IPayload;

    Object.assign(request, {
      user: {
        id: user_id,
      },
    });

    return next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}


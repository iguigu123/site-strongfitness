import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  const usersRepository = container.resolve<IUsersRepository>('UsersRepository');
  const user = await usersRepository.findById(id);

  if (!user) {
    throw new AppError('User not found', 401);
  }

  if (user.role !== 'ADMIN') {
    throw new AppError('User is not an administrator', 403); // 403 Forbidden
  }

  return next();
}

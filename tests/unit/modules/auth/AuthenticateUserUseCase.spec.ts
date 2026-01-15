import 'reflect-metadata';
import { AuthenticateUserUseCase } from '@modules/auth/useCases/authenticateUser/AuthenticateUserUseCase';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate a user', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'user@example.com',
      password_hash: await hash('password', 8),
    });

    const response = await authenticateUserUseCase.execute({
      email: 'user@example.com',
      password: 'password',
    });

    expect(response).toHaveProperty('token');
    expect(response.user.email).toBe('user@example.com');
  });

  it('should not be able to authenticate an nonexistent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'false@example.com',
        password: 'password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'user@example.com',
      password_hash: await hash('password', 8),
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'user@example.com',
        password: 'incorrect',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

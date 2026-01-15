import 'reflect-metadata';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@example.com',
      password: 'password',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('User Test');
  });

  it('should not be able to create a user with exists email', async () => {
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@example.com',
      password: 'password',
    });

    await expect(
      createUserUseCase.execute({
        name: 'User Test',
        email: 'user@example.com',
        password: 'password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

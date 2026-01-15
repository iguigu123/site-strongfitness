import { inject, injectable } from 'tsyringe';
import { hash } from 'bcryptjs';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { IUsersRepository } from '../repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

export interface ICreateUserRequest extends Omit<ICreateUserDTO, 'password_hash'> {
  password: string;
}

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ name, email, password, isAdmin, role }: ICreateUserRequest) {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError('User already exists');
    }

    const passwordHash = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
      isAdmin,
      role,
    });

    return user;
  }
}


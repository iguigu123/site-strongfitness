import { sign, SignOptions } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { compare } from 'bcryptjs';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import authConfig from '@config/auth';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect');
    }

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const signOptions: SignOptions = {
      subject: user.id,
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };

    const token = sign({}, secret as string, signOptions);

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}

export { AuthenticateUserUseCase };

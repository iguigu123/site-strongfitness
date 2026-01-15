import { sign, SignOptions } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/auth/repositories/IUserTokensRepository';
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
  refresh_token: string;
}

@injectable()
export class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
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

    const { secret, expiresIn, refreshTokenExpiresInDays } = authConfig.jwt;

    const signOptions: SignOptions = {
      subject: user.id,
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };

    const token = sign({}, secret as string, signOptions);

    const refresh_token = uuidv4();
    const expires_date = new Date();
    expires_date.setDate(expires_date.getDate() + refreshTokenExpiresInDays);

    await this.userTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date,
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token,
    };
  }
}


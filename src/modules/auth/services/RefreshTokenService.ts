import { sign, SignOptions } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IUserTokensRepository } from '@modules/auth/repositories/IUserTokensRepository';
import authConfig from '@config/auth';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  refresh_token: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenService {
  constructor(
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  async execute({ refresh_token }: IRequest): Promise<IResponse> {
    const userToken = await this.userTokensRepository.findByRefreshToken(refresh_token);

    if (!userToken) {
      throw new AppError('Refresh Token does not exist!');
    }

    if (userToken.expires_date.getTime() < new Date().getTime()) {
        // Optional: delete expired token
        await this.userTokensRepository.deleteById(userToken.id);
        throw new AppError('Refresh Token expired!');
    }

    const { secret, expiresIn, refreshTokenExpiresInDays } = authConfig.jwt;

    const signOptions: SignOptions = {
      subject: userToken.user_id,
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };

    const token = sign({}, secret as string, signOptions);

    // Rotate Refresh Token
    await this.userTokensRepository.deleteById(userToken.id);

    const new_refresh_token = uuidv4();
    const expires_date = new Date();
    expires_date.setDate(expires_date.getDate() + refreshTokenExpiresInDays);

    await this.userTokensRepository.create({
      user_id: userToken.user_id,
      refresh_token: new_refresh_token,
      expires_date,
    });

    return {
      token,
      refresh_token: new_refresh_token,
    };
  }
}

import { prisma } from '@shared/infra/prisma/client';
import { ICreateUserTokenDTO } from '../../dtos/ICreateUserTokenDTO';
import { UserToken } from '../../entities/UserToken';
import { IUserTokensRepository } from '../IUserTokensRepository';

class UserTokensRepositoryPrisma implements IUserTokensRepository {
  async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserToken> {
    const created = await prisma.refreshToken.create({
      data: {
        user_id,
        token: refresh_token,
        expires_at: expires_date,
      },
    });

    const userToken = new UserToken();

    Object.assign(userToken, {
      id: created.id,
      refresh_token: created.token,
      user_id: created.user_id,
      expires_date: created.expires_at,
      created_at: created.created_at,
    });

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken | undefined> {
    const found = await prisma.refreshToken.findFirst({
      where: {
        user_id,
        token: refresh_token,
      },
    });

    if (!found) {
      return undefined;
    }

    const userToken = new UserToken();

    Object.assign(userToken, {
      id: found.id,
      refresh_token: found.token,
      user_id: found.user_id,
      expires_date: found.expires_at,
      created_at: found.created_at,
    });

    return userToken;
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken | undefined> {
    const found = await prisma.refreshToken.findUnique({
      where: { token: refresh_token },
    });

    if (!found) {
      return undefined;
    }

    const userToken = new UserToken();

    Object.assign(userToken, {
      id: found.id,
      refresh_token: found.token,
      user_id: found.user_id,
      expires_date: found.expires_at,
      created_at: found.created_at,
    });

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { id },
    });
  }
}

export { UserTokensRepositoryPrisma };


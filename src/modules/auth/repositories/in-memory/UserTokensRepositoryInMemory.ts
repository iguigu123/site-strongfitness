import { ICreateUserTokenDTO } from '../../dtos/ICreateUserTokenDTO';
import { UserToken } from '../../entities/UserToken';
import { IUserTokensRepository } from '../IUserTokensRepository';

class UserTokensRepositoryInMemory implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      expires_date,
      refresh_token,
      user_id,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken | undefined> {
    return this.userTokens.find(
      (token) => token.user_id === user_id && token.refresh_token === refresh_token
    );
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken | undefined> {
    return this.userTokens.find((token) => token.refresh_token === refresh_token);
  }

  async deleteById(id: string): Promise<void> {
    const index = this.userTokens.findIndex((token) => token.id === id);
    if (index !== -1) {
      this.userTokens.splice(index, 1);
    }
  }
}

export { UserTokensRepositoryInMemory };

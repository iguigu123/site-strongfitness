import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserToken } from '../entities/UserToken';

export interface IUserTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken | undefined>;
  findByRefreshToken(refresh_token: string): Promise<UserToken | undefined>;
  deleteById(id: string): Promise<void>;
}

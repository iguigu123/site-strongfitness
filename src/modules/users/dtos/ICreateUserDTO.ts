export interface ICreateUserDTO {
  name: string;
  email: string;
  password_hash: string;
  isAdmin?: boolean;
  role?: 'ADMIN' | 'USER';
}

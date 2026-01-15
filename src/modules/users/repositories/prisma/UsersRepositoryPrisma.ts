import { prisma } from '@shared/infra/prisma/client';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

class UsersRepositoryPrisma implements IUsersRepository {
  async create({ name, email, password_hash, isAdmin, role }: ICreateUserDTO): Promise<User> {
    const created = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role: role ?? 'USER',
      },
    });

    const user = new User();

    Object.assign(user, {
      id: created.id,
      name: created.name,
      email: created.email,
      password_hash: created.password_hash,
      isAdmin: created.role === 'ADMIN',
      role: created.role,
      created_at: created.created_at,
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const found = await prisma.user.findUnique({
      where: { email },
    });

    if (!found) {
      return undefined;
    }

    const user = new User();

    Object.assign(user, {
      id: found.id,
      name: found.name,
      email: found.email,
      password_hash: found.password_hash,
      isAdmin: found.role === 'ADMIN',
      role: found.role,
      created_at: found.created_at,
    });

    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    const found = await prisma.user.findUnique({
      where: { id },
    });

    if (!found) {
      return undefined;
    }

    const user = new User();

    Object.assign(user, {
      id: found.id,
      name: found.name,
      email: found.email,
      password_hash: found.password_hash,
      isAdmin: found.role === 'ADMIN',
      role: found.role,
      created_at: found.created_at,
    });

    return user;
  }
}

export { UsersRepositoryPrisma };


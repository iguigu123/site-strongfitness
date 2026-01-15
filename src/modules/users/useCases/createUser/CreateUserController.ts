import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from './CreateUserUseCase';
import { z } from 'zod';

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createUserSchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      isAdmin: z.boolean().optional(),
      role: z.enum(['ADMIN', 'USER']).optional(),
    });

    const { name, email, password, isAdmin, role } = createUserSchema.parse(request.body);

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      name,
      email,
      password,
      isAdmin,
      role,
    });

    const { id, name: userName, email: userEmail, role: userRole, created_at } = user;

    return response.status(201).json({
      id,
      name: userName,
      email: userEmail,
      role: userRole,
      created_at,
    });
  }
}

export { CreateUserController };

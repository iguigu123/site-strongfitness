import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';
import { CreateUserService } from '../services/CreateUserService';
import { successResponse } from '@shared/http/response';

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createUserSchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      isAdmin: z.boolean().optional(),
    });

    const { name, email, password, isAdmin } = createUserSchema.parse(
      request.body
    );

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name,
      email,
      password,
      isAdmin,
    });

    return successResponse(response, user, 'User created', 201);
  }
}


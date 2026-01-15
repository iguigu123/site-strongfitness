import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';
import { AuthenticateUserService } from '../services/AuthenticateUserService';
import { successResponse } from '@shared/http/response';

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const authSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = authSchema.parse(request.body);

    const authenticateUserService = container.resolve(
      AuthenticateUserService
    );

    const result = await authenticateUserService.execute({
      email,
      password,
    });

    return successResponse(response, result, 'Authenticated');
  }
}


import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { z } from 'zod';

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const authSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = authSchema.parse(request.body);

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const token = await authenticateUserUseCase.execute({
      email,
      password,
    });

    return response.json(token);
  }
}

export { AuthenticateUserController };

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenService } from '../services/RefreshTokenService';
import { successResponse } from '@shared/http/response';

export class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { refresh_token } = request.body;

    const refreshTokenService = container.resolve(RefreshTokenService);

    const tokenData = await refreshTokenService.execute({
      refresh_token,
    });

    return successResponse(response, tokenData, 'Token refreshed successfully');
  }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListProductsService } from '../services/ListProductsService';
import { successResponse } from '@shared/http/response';

export class ListProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listProductsService = container.resolve(ListProductsService);
    const products = await listProductsService.execute();
    return successResponse(response, products, 'Products list');
  }
}


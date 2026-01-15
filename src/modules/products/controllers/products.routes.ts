import { Router } from 'express';
import { ListProductsController } from './ListProductsController';

const productsRoutes = Router();
const listProductsController = new ListProductsController();

productsRoutes.get('/', listProductsController.handle);

export { productsRoutes };


import { Router } from 'express';
import { ListProductsController } from '../../../useCases/listProducts/ListProductsController';
import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';
import { ensureAdmin } from '@shared/middlewares/ensureAdmin';

const productsRoutes = Router();
const listProductsController = new ListProductsController();

productsRoutes.get('/', listProductsController.handle);

export { productsRoutes };

import { Router } from 'express';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';
import { CreateOrderController } from '../../../controllers/CreateOrderController';

const ordersRoutes = Router();

const createOrderController = new CreateOrderController();

ordersRoutes.post('/', ensureAuthenticated, createOrderController.handle);

export { ordersRoutes };


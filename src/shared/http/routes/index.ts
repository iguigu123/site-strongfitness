import { Router } from 'express';

import { authenticateRoutes } from '@modules/auth/controllers/authenticate.routes';
import { usersRoutes } from '@modules/users/controllers/users.routes';
import { productsRoutes } from '@modules/products/controllers/products.routes';

const router = Router();

router.get('/health', (request, response) => {
  return response.json({ status: 'ok', timestamp: new Date() });
});

router.use('/auth', authenticateRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);

export { router };


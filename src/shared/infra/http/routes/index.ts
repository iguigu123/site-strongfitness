import { Router } from 'express';

// Import routes
import { authenticateRoutes } from '@modules/auth/infra/http/routes/authenticate.routes';
import { usersRoutes } from '@modules/users/infra/http/routes/users.routes';
import { productsRoutes } from '@modules/products/infra/http/routes/products.routes';
import { ordersRoutes } from '@modules/orders/infra/http/routes/orders.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

router.use('/auth', authenticateRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);

export { router };

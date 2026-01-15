import { Router } from 'express';
import { AuthenticateUserController } from '../../../controllers/AuthenticateUserController';
import { RefreshTokenController } from '../../../controllers/RefreshTokenController';

const authenticateRoutes = Router();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

authenticateRoutes.post('/sessions', authenticateUserController.handle);
authenticateRoutes.post('/refresh-token', refreshTokenController.handle);

export { authenticateRoutes };

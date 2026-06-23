import express from 'express';
import authController from '../controllers/auth.controller.js';
import { validateRegisterInput } from '../middlewares/validator.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', validateRegisterInput, authController.register);

authRouter.get('/verify-email', authController.verifyEmail);

authRouter.post('/login', authController.login);

authRouter.get('/me', authMiddleware, authController.getMe);
authRouter.put('/me', authMiddleware, authController.updateMe);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);

export default authRouter;
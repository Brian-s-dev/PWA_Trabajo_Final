import express from 'express';
import statsController from '../controllers/stats.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.constant.js';

const statsRouter = express.Router();

statsRouter.get('/admin', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]), statsController.getAdminStats);

export default statsRouter;

import express from 'express';
import aiController from '../controllers/ai.controller.js';
import { uploadPdf } from '../middlewares/upload.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.constant.js';

const aiRouter = express.Router();

// Ruta protegida solo para administradores
aiRouter.post(
    '/generate-course',
    authMiddleware,
    roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]),
    uploadPdf.single('pdf'),
    aiController.generateCourseFromPdf.bind(aiController)
);

export default aiRouter;

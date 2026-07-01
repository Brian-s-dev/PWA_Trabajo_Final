import express from 'express';
import aiController from '../controllers/ai.controller.js';
<<<<<<< HEAD
import { uploadPdfMiddleware } from '../middlewares/upload.middleware.js';
=======
import { uploadPdf } from '../middlewares/upload.middleware.js';
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.constant.js';

const aiRouter = express.Router();

<<<<<<< HEAD
=======
// Ruta protegida solo para administradores
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
aiRouter.post(
    '/generate-course',
    authMiddleware,
    roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]),
<<<<<<< HEAD
    uploadPdfMiddleware,
=======
    uploadPdf.single('pdf'),
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
    aiController.generateCourseFromPdf.bind(aiController)
);

export default aiRouter;

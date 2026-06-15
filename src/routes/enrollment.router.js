import express from 'express';
import enrollmentController from '../controllers/enrollment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const enrollmentRouter = express.Router();

enrollmentRouter.use(authMiddleware);

enrollmentRouter.post('/assign', enrollmentController.assignCourse);
enrollmentRouter.get('/my-courses', enrollmentController.getMyCourses);
enrollmentRouter.put('/:id/complete-module', enrollmentController.markModuleCompleted);

export default enrollmentRouter;

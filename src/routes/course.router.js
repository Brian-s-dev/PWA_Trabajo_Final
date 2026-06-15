import express from 'express';
import courseController from '../controllers/course.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const courseRouter = express.Router();

courseRouter.use(authMiddleware);

courseRouter.post('/', courseController.createCourse);
courseRouter.get('/', courseController.getAllCourses);
courseRouter.get('/:id', courseController.getCourseById);
courseRouter.put('/:id', courseController.updateCourse);
courseRouter.delete('/:id', courseController.deleteCourse);

export default courseRouter;
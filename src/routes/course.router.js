import express from 'express';
import courseController from '../controllers/course.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verifyCourseExists } from '../middlewares/course.middleware.js';
import moduleRouter from './module.router.js';

const courseRouter = express.Router();

courseRouter.use(authMiddleware);

courseRouter.get('/', courseController.getAllCourses);
courseRouter.post('/', courseController.createCourse);

courseRouter.get('/:id', verifyCourseExists, courseController.getCourseById);

courseRouter.put('/:id', verifyCourseExists, courseController.updateCourse);

courseRouter.delete('/:id', verifyCourseExists, courseController.deleteCourse);

courseRouter.use('/:course_id/modules', verifyCourseExists, moduleRouter);

export default courseRouter;
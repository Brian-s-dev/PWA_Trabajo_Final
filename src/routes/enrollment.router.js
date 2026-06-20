import express from 'express';
import enrollmentController from '../controllers/enrollment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.constant.js';

const enrollmentRouter = express.Router();

enrollmentRouter.use(authMiddleware);

enrollmentRouter.get(
    '/my_courses',
    roleMiddleware([ROLES.ADMIN, ROLES.EMPLOYEE]),
    enrollmentController.getMyCourses
);

enrollmentRouter.get(
    '/employee/:employee_id',
    roleMiddleware([ROLES.ADMIN]),
    enrollmentController.getEmployeeCourses
);

enrollmentRouter.post(
    '/assign_course',
    roleMiddleware([ROLES.ADMIN]),
    enrollmentController.assignCourse
);

enrollmentRouter.put(
    '/:course_id/progress',
    roleMiddleware([ROLES.ADMIN, ROLES.EMPLOYEE]),
    enrollmentController.markModuleCompleted
);

export default enrollmentRouter;
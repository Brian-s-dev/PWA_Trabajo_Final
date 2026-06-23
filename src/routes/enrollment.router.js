import express from 'express';
import enrollmentController from '../controllers/enrollment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.constant.js';

const enrollmentRouter = express.Router();

enrollmentRouter.use(authMiddleware);

enrollmentRouter.get(
    '/my_courses',
    roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.EMPLOYEE]),
    enrollmentController.getMyCourses
);

enrollmentRouter.get(
    '/employee/:employee_id',
    roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]),
    enrollmentController.getEmployeeCourses
);

enrollmentRouter.get(
    '/course/:course_id',
    roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]),
    enrollmentController.getCourseEnrollments
);

enrollmentRouter.post(
    '/assign_course',
    roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]),
    enrollmentController.assignCourse
);

enrollmentRouter.put(
    '/:course_id/progress',
    roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.EMPLOYEE]),
    enrollmentController.markModuleCompleted
);

export default enrollmentRouter;
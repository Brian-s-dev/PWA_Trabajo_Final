import express from 'express';
import userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { ROLES } from '../constants/roles.constant.js';

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.use(roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]));

userRouter.get(
    '/',
    userController.getAllUsers
);
userRouter.post(
    '/',
    userController.createUser
);
userRouter.put(
    '/:id',
    userController.updateUser
);
userRouter.delete(
    '/:id',
    userController.deleteUser
);

export default userRouter;

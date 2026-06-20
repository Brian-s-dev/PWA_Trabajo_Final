import express from 'express';
import moduleController from '../controllers/module.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verifyCourseExists } from '../middlewares/course.middleware.js';

const moduleRouter = express.Router({
    mergeParams: true
});

moduleRouter.use(authMiddleware);

moduleRouter.post('/', verifyCourseExists, moduleController.createModule);
moduleRouter.get('/', verifyCourseExists, moduleController.getCourseModules);

moduleRouter.put('/:module_id', verifyCourseExists, moduleController.updateModule);
moduleRouter.delete('/:module_id', verifyCourseExists, moduleController.deleteModule);

export default moduleRouter;
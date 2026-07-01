import express from 'express';
import moduleController from '../controllers/module.controller.js';

const moduleRouter = express.Router({
    mergeParams: true
});

moduleRouter.post(
    '/',
    moduleController.createModule
);
moduleRouter.get(
    '/',
    moduleController.getCourseModules
);
moduleRouter.put(
    '/:module_id',
    moduleController.updateModule
);
moduleRouter.delete(
    '/:module_id',
    moduleController.deleteModule
);

export default moduleRouter;    
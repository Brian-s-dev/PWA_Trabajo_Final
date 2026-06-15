import express from 'express';
import moduleController from '../controllers/module.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const moduleRouter = express.Router();

moduleRouter.use(authMiddleware);

moduleRouter.post('/:courseId', moduleController.createModule);
moduleRouter.put('/:id', moduleController.updateModule);
moduleRouter.delete('/:id', moduleController.deleteModule);

export default moduleRouter;
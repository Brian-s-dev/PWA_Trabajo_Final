import express from 'express';
import { registerUser } from '../controllers/auth.controller.js';
import { validateRegisterInput } from '../middlewares/validator.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', validateRegisterInput, registerUser);

export default authRouter;
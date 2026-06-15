import express from 'express';
import cors from 'cors';
import dns from 'dns';
import ENVIRONMENT from './config/environment.config.js';
import { connectMongoDB } from './config/mongodb.config.js';
import authRouter from './routes/auth.router.js';
import courseRouter from './routes/course.router.js';
import enrollmentRouter from './routes/enrollment.router.js';
import errorHandlerMiddleware from './middlewares/error.middleware.js';
import moduleRouter from './routes/module.router.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.status(200).json({ ok: true, mensaje: '🚀 API LMS Onboarding funcionando' });
});

app.use('/api/auth', authRouter);

app.use('/api/courses', courseRouter);

app.use('/api/modules', moduleRouter);

app.use('/api/enrollments', enrollmentRouter);

app.use(errorHandlerMiddleware);

const startServer = async () => {
    await connectMongoDB();
    app.listen(ENVIRONMENT.PORT, () => {
        console.log(`🌐 Servidor corriendo en http://localhost:${ENVIRONMENT.PORT}`);
    });
};

startServer();
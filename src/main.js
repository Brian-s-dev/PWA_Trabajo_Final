import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';
import ENVIRONMENT from './config/environment.config.js';
import { connectMongoDB } from './config/mongodb.config.js';
import authRouter from './routes/auth.router.js';
import courseRouter from './routes/course.router.js';
import enrollmentRouter from './routes/enrollment.router.js';
import userRouter from './routes/user.router.js';
import errorHandlerMiddleware from './middlewares/error.middleware.js';
import moduleRouter from './routes/module.router.js';
import statsRouter from './routes/stats.router.js';

if (ENVIRONMENT.MODE === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    maxAge: 86400 // Cache preflight requests for 24 hours
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/ping', (req, res) => {
    res.status(200).json({ ok: true, mensaje: '🚀 API LMS Onboarding funcionando' });
});

if (process.env.VERCEL) {
    // Middleware para asegurar la conexión en entornos Serverless
    app.use(async (req, res, next) => {
        // readyState 1 significa conectado
        if (mongoose.connection.readyState !== 1) {
            await connectMongoDB();
        }
        next();
    });
}

app.use('/api/auth', authRouter);

app.use('/api/courses', courseRouter);

app.use('/api/enrollments', enrollmentRouter);

app.use('/api/users', userRouter);

app.use('/api/stats', statsRouter);

app.use(errorHandlerMiddleware);

if (!process.env.VERCEL) {
    // Si estamos en local (localhost), iniciamos el servidor normalmente
    const startServer = async () => {
        await connectMongoDB();
        app.listen(ENVIRONMENT.PORT, () => {
            console.log(`🌐 Servidor corriendo en http://localhost:${ENVIRONMENT.PORT}`);
        });
    };
    startServer();
}

export default app;
import express from 'express';
import cors from 'cors';
import ENVIRONMENT from './config/environment.config.js';
import connectMongoDB from './config/mongodb.config.js';
import dns from 'dns';

if (ENVIRONMENT.MODE === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: '🚀 API LMS Onboarding funcionando correctamente'
    });
});

const startServer = async () => {
    await connectMongoDB();

    app.listen(ENVIRONMENT.PORT, () => {
        console.log(`🌐 Servidor corriendo en http://localhost:${ENVIRONMENT.PORT}`);
    });
};

startServer();
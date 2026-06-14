import mongoose from 'mongoose';
import ENVIRONMENT from './environment.config.js';

export const connectMongoDB = async () => {
    try {

        const conn = await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING, {
            dbName: ENVIRONMENT.MONGO_DB_NAME
        });
        console.log(`🟢 MongoDB Conectado`);
    } catch (error) {
        console.error(`🔴 Error en MongoDB: ${error.message}`);
    }
};

export default connectMongoDB;
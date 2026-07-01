import dotenv from 'dotenv';

dotenv.config();

const ENVIRONMENT = {
    PORT: process.env.PORT,
    MODE: process.env.MODE,
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    URL_FRONTEND: process.env.URL_FRONTEND,
    URL_BACKEND: process.env.URL_BACKEND,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

export default ENVIRONMENT;
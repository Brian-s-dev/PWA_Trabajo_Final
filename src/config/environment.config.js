import dotenv from 'dotenv';

dotenv.config();

const ENVIRONMENT = {
    PORT: process.env.PORT,
    MODE: process.env.MODE,
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD
};

export default ENVIRONMENT;
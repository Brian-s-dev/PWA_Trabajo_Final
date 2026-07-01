import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import ENVIRONMENT from './environment.config.js';

cloudinary.config({
    cloud_name: ENVIRONMENT.CLOUDINARY_CLOUD_NAME,
    api_key: ENVIRONMENT.CLOUDINARY_API_KEY,
    api_secret: ENVIRONMENT.CLOUDINARY_API_SECRET
});

export const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

export default cloudinary;

/* TEST TEST TEST TEST TEST */
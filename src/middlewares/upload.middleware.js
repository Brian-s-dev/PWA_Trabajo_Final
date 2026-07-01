import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { avatarStorage } from '../config/cloudinary.config.js';
import os from 'os';
import ServerError from '../helpers/serverError.helper.js';

// Hice un almacenamient temporar de los pds para que los tome la ia al momento de crear los cursos por ese medio.
const pdfUploadDir = path.join(os.tmpdir(), 'temp_pdfs');
if (!fs.existsSync(pdfUploadDir)) {
    fs.mkdirSync(pdfUploadDir, { recursive: true });
}

const localPdfStorage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, pdfUploadDir);
    },
    filename: function (request, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'temp-pdf-' + uniqueSuffix + '.pdf');
    }
});

const pdfFilter = (request, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no soportado. Solo se permiten PDFs.'), false);
    }
};

export const uploadPdf = multer({
    storage: localPdfStorage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo
    }
});

// --- Almacenamiento en Cloudinary para Avatares ---
const imageFilter = (request, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no soportado. Solo se permiten imágenes.'), false);
    }
};

export const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export const uploadPdfMiddleware = (request, response, next) => {
    const upload = uploadPdf.single('pdf');
    upload(request, response, function (err) {
        if (err instanceof multer.MulterError) {
            return next(new ServerError(`Error de subida: ${err.message}`, 400));
        } else if (err) {
            return next(new ServerError(err.message, 400));
        }
        next();
    });
};

export const uploadAvatarMiddleware = (request, response, next) => {
    const upload = uploadAvatar.single('avatar');
    upload(request, response, function (err) {
        if (err instanceof multer.MulterError) {
            return next(new ServerError(`Error de subida: ${err.message}`, 400));
        } else if (err) {
            return next(new ServerError(err.message, 400));
        }
        next();
    });
};

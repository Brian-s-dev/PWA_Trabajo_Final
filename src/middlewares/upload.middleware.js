import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { avatarStorage } from '../config/cloudinary.config.js';

import os from 'os';

// --- Almacenamiento local temporal para PDFs ---
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

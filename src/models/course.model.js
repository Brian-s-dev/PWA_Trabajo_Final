import mongoose from 'mongoose';
import { MODELS } from '../constants/models.constant.js';

const courseSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    modulos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: MODELS.MODULE
        }
    ],
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.USER,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model(MODELS.COURSE, courseSchema);
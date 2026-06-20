import { MODELS } from '../constants/models.constant.js';
import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    curso_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.COURSE,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model(MODELS.MODULE, moduleSchema);
import mongoose from 'mongoose';
import { MODELS } from '../constants/models.constant.js';
import { ENROLLMENT_STATUS } from '../constants/enrollmentStatus.constant.js';

const enrollmentSchema = new mongoose.Schema({
    empleado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.USER,
        required: true
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.COURSE,
        required: true
    },
    estado: {
        type: String,
        enum: [ENROLLMENT_STATUS.PENDIENTE, ENROLLMENT_STATUS.EN_PROGRESO, ENROLLMENT_STATUS.COMPLETADO],
        default: ENROLLMENT_STATUS.PENDIENTE
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model(MODELS.ENROLLMENT, enrollmentSchema);
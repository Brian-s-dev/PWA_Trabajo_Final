import mongoose from 'mongoose';
import { MODELS } from '../constants/models.constant.js';
import { MODULE_STATUS } from '../constants/moduleStatus.constant.js';

const enrollmentModuleSchema = new mongoose.Schema({
    enrollment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.ENROLLMENT,
        required: true
    },
    modulo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.MODULE,
        required: true
    },
    estado: {
        type: String,
        enum: [MODULE_STATUS.PENDIENTE, MODULE_STATUS.COMPLETADO],
        default: MODULE_STATUS.PENDIENTE
    },
    fechaCompletado: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export default mongoose.model(MODELS.ENROLLMENT_MODULE, enrollmentModuleSchema);

import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    empleado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO'],
        default: 'PENDIENTE'
    },
    modulosCompletados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }]
}, { timestamps: true });

export default mongoose.model('Enrollment', enrollmentSchema);
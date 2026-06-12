import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    empleado_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    curso_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO'],
        default: 'PENDIENTE'
    },
    modulos_vistos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module'
        }
    ],
    fecha_asignacion: {
        type: Date,
        default: Date.now
    },
    fecha_finalizacion: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model('Enrollment', enrollmentSchema);
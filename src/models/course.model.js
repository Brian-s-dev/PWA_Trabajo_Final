import mongoose from 'mongoose';

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
            ref: 'Module'
        }
    ],
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Course', courseSchema);
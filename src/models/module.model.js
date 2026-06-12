import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
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

export default mongoose.model('Module', moduleSchema);
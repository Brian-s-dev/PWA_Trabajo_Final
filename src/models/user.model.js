import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email_verificado: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['ADMIN', 'EMPLOYEE'],
        default: 'EMPLOYEE'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
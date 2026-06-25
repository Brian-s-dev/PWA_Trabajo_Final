import { MODELS } from '../constants/models.constant.js';
import mongoose from 'mongoose';
import { ROLES } from '../constants/roles.constant.js';

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
        enum: [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.SUPERADMIN],
        default: ROLES.EMPLOYEE
    },
    avatar: {
        type: String,
        default: null
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model(MODELS.USER, userSchema);
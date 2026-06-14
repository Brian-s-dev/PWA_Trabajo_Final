import bcrypt from 'bcrypt';
import crypto from 'crypto';
import userRepository from '../repositories/user.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import mailService from './mail.service.js';

class AuthService {
    async register(userData) {
        const { nombre, email, password, rol } = userData;

        const userExists = await userRepository.findUserByEmail(email);
        if (userExists) {
            throw new ServerError('El email ya está registrado', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await userRepository.createUser({
            nombre, email,
            password: hashedPassword,
            rol: rol,
            verificationToken
        });

        await mailService.sendVerificationEmail(email, nombre, verificationToken);
        return newUser;
    }
}
export default new AuthService();
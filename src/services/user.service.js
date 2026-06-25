import userRepository from '../repositories/user.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import mailService from './mail.service.js';
import { ROLES } from '../constants/roles.constant.js';

class UserService {
    async getAllUsers(query) {
        return await userRepository.findAllUsers(query);
    }

    async createUser(userData, currentUser) {
        const { nombre, email, password, rol } = userData;

        if (currentUser.rol === ROLES.EMPLOYEE) {
            throw new ServerError('No tienes permisos para crear usuarios manualmente', 403);
        }

        if (rol === ROLES.SUPERADMIN) {
            throw new ServerError('No se puede crear un SUPERADMIN directamente', 403);
        }

        if (rol === ROLES.ADMIN && currentUser.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('Solo un SUPERADMIN puede crear otros administradores', 403);
        }

        const userExists = await userRepository.findUserByEmail(email);
        if (userExists) throw new ServerError('El usuario ya existe', 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userRepository.createUser({
            nombre,
            email,
            password: hashedPassword,
            email_verificado: false,
            rol: rol || ROLES.EMPLOYEE
        });

        const verificationToken = jwt.sign(
            { email: newUser.email },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const verificationUrl = `${ENVIRONMENT.URL_FRONTEND}/verify-email?verification_token=${verificationToken}`;

        await mailService.sendVerificationEmail(email, newUser.nombre, verificationUrl);

        newUser.password = undefined;
        return newUser;
    }

    async updateUser(id, updateData, currentUser) {
        if (currentUser.rol === ROLES.EMPLOYEE) {
            throw new ServerError('No tienes permisos', 403);
        }

        const userToUpdate = await userRepository.findUserById(id);
        if (!userToUpdate) throw new ServerError('Usuario no encontrado', 404);

        if (updateData.rol && updateData.rol === ROLES.SUPERADMIN && currentUser.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('Solo un SUPERADMIN puede asignar el rol de SUPERADMIN', 403);
        }

                if (userToUpdate.rol === ROLES.SUPERADMIN && currentUser.rol !== ROLES.SUPERADMIN) {
             throw new ServerError('No puedes modificar a un SUPERADMIN', 403);
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await userRepository.updateById(id, updateData);
        return updatedUser;
    }

    async deleteUser(id, currentUser, isHardDelete = false) {
        if (currentUser.rol === ROLES.EMPLOYEE) {
            throw new ServerError('No tienes permisos para eliminar usuarios', 403);
        }

        if (id === currentUser.id) {
            throw new ServerError('No puedes eliminar tu propia cuenta', 403);
        }

        const userToDelete = await userRepository.findUserById(id);
        if (!userToDelete) throw new ServerError('Usuario no encontrado', 404);

        if (userToDelete.rol === ROLES.SUPERADMIN) {
            throw new ServerError('No puedes eliminar a un SUPERADMIN', 403);
        }

        if (isHardDelete) {
            if (currentUser.rol !== ROLES.SUPERADMIN) {
                throw new ServerError('Solo un SUPERADMIN puede hacer borrado físico', 403);
            }
            await userRepository.hardDeleteById(id);
            return { message: 'Usuario eliminado físicamente' };
        } else {
            await userRepository.deleteById(id);
            return { message: 'Usuario desactivado lógicamente' };
        }
    }
}

export default new UserService();

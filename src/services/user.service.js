import userRepository from '../repositories/user.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import mailService from './mail.service.js';
import { ROLES } from '../constants/roles.constant.js';

class UserService {
    /**
     * Obtiene todos los usuarios basándose en filtros y paginación.
     * @param {Object} query - Objeto con los parámetros de búsqueda de la URL.
     * @returns {Promise<Array>} Lista de usuarios.
     */
    async getAllUsers(query) {
        return await userRepository.findAllUsers(query);
    }

    /**
     * Crea un nuevo usuario manualmente. Solo para uso interno de administradores.
     * @param {Object} userData - Datos del nuevo usuario (nombre, email, password, rol).
     * @param {Object} currentUser - Usuario que ejecuta la acción (ADMIN o SUPERADMIN).
     * @returns {Promise<Object>} El usuario creado (sin contraseña).
     * @throws {ServerError} Si no tiene permisos, el usuario ya existe o intenta crear un rol superior.
     */
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

    /**
     * Actualiza la información de un usuario existente.
     * @param {string} id - ID del usuario a modificar.
     * @param {Object} updateData - Datos a actualizar.
     * @param {Object} currentUser - Usuario que ejecuta la acción.
     * @returns {Promise<Object>} El usuario actualizado.
     * @throws {ServerError} Si no tiene permisos, el usuario no existe, o intenta modificar a un superior.
     */
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

    /**
     * Elimina a un usuario, ya sea lógicamente (soft) o físicamente (hard).
     * @param {string} id - ID del usuario a eliminar.
     * @param {Object} currentUser - Usuario que ejecuta la acción.
     * @param {boolean} [isHardDelete=false] - Indica si el borrado es definitivo en base de datos.
     * @returns {Promise<Object>} Mensaje de confirmación de la eliminación.
     * @throws {ServerError} Si no tiene permisos o intenta eliminarse a sí mismo o a un SUPERADMIN.
     */
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

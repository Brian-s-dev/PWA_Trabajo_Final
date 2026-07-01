import moduleRepository from '../repositories/module.repository.js';
import courseRepository from '../repositories/course.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import { ROLES } from '../constants/roles.constant.js';

class ModuleService {

    /**
     * Crea un nuevo módulo y lo asocia a un curso específico.
     * @param {string} course_id - ID del curso al que pertenecerá el módulo.
     * @param {Object} moduleData - Datos del módulo a crear.
     * @param {Object} user - Usuario que realiza la acción (ADMIN o SUPERADMIN).
     * @returns {Promise<Object>} El módulo creado.
     * @throws {ServerError} Si no hay permisos o el curso no existe.
     */
    async createModule(course_id, moduleData, user) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('No tienes permisos para crear módulos', 403);
        }

        const course = await courseRepository.findById(course_id);
        if (!course || !course.activo) {
            throw new ServerError('El curso especificado no existe', 404);
        }

        moduleData.curso_id = course_id;

        const newModule = await moduleRepository.create(moduleData);

        course.modulos.push(newModule._id);

        await course.save();

        return newModule;
    }

    /**
     * Obtiene todos los módulos asociados a un curso.
     * @param {string} course_id - ID del curso.
     * @returns {Promise<Array>} Lista de módulos del curso.
     */
    async getModulesByCourseId(course_id) {
        return await moduleRepository.findByCourseId(course_id);
    }

    /**
     * Actualiza la información de un módulo existente.
     * @param {string} id - ID del módulo a modificar.
     * @param {Object} updateData - Datos a actualizar en el módulo.
     * @param {Object} user - Usuario que realiza la petición (ADMIN o SUPERADMIN).
     * @returns {Promise<Object>} El módulo actualizado.
     * @throws {ServerError} Si no hay permisos o el módulo no existe.
     */
    async updateModule(id, updateData, user) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) throw new ServerError('Sin permisos', 403);

        const updatedModule = await moduleRepository.updateById(id, updateData);
        if (!updatedModule) throw new ServerError('Módulo no encontrado', 404);

        return updatedModule;
    }

    /**
     * Elimina un módulo, ya sea lógica o físicamente. 
     * También remueve la referencia del módulo en el documento del curso asociado.
     * @param {string} id - ID del módulo a eliminar.
     * @param {Object} user - Usuario que realiza la acción (ADMIN para soft, SUPERADMIN para hard).
     * @param {boolean} [isHardDelete=false] - Indica si el borrado es permanente.
     * @returns {Promise<Object>} El módulo eliminado.
     * @throws {ServerError} Si no hay permisos o el módulo no existe.
     */
    async deleteModule(id, user, isHardDelete = false) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) throw new ServerError('Sin permisos', 403);

        let deletedModule;
        if (isHardDelete) {
            if (user.rol !== ROLES.SUPERADMIN) {
                throw new ServerError('Solo un SUPERADMIN puede hacer borrado físico', 403);
            }
            deletedModule = await moduleRepository.hardDeleteById(id);
        } else {
            deletedModule = await moduleRepository.deleteById(id);
        }

        if (!deletedModule) throw new ServerError('Módulo no encontrado', 404);

        const course = await courseRepository.findById(deletedModule.curso_id);
        if (course) {
            course.modulos.pull(deletedModule._id);
            await course.save();
        }

        return deletedModule;
    }
}

export default new ModuleService();
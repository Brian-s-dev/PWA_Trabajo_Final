import moduleRepository from '../repositories/module.repository.js';
import courseRepository from '../repositories/course.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import { ROLES } from '../constants/roles.constant.js';

class ModuleService {

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

    async getModulesByCourseId(course_id) {
        return await moduleRepository.findByCourseId(course_id);
    }

    async updateModule(id, updateData, user) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) throw new ServerError('Sin permisos', 403);

        const updatedModule = await moduleRepository.updateById(id, updateData);
        if (!updatedModule) throw new ServerError('Módulo no encontrado', 404);

        return updatedModule;
    }

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
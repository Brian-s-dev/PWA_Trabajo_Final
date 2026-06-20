import moduleRepository from '../repositories/module.repository.js';
import courseRepository from '../repositories/course.repository.js';
import ServerError from '../helpers/serverError.helper.js';

class ModuleService {

    async createModule(course_id, moduleData, user) {
        if (user.rol !== 'ADMIN') {
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

    async getModulesBycourse_id(course_id) {
        return await moduleRepository.findBycourse_id(course_id);
    }

    async updateModule(id, updateData, user) {
        if (user.rol !== 'ADMIN') throw new ServerError('Sin permisos', 403);

        const updatedModule = await moduleRepository.updateById(id, updateData);
        if (!updatedModule) throw new ServerError('Módulo no encontrado', 404);

        return updatedModule;
    }

    async deleteModule(id, user) {
        if (user.rol !== 'ADMIN') throw new ServerError('Sin permisos', 403);

        const deletedModule = await moduleRepository.deleteById(id);
        if (!deletedModule) throw new ServerError('Módulo no encontrado', 404);

        return deletedModule;
    }
}

export default new ModuleService();
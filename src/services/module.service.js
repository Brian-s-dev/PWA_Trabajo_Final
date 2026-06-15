import moduleRepository from '../repositories/module.repository.js';
import courseRepository from '../repositories/course.repository.js';
import ServerError from '../helpers/serverError.helper.js';

class ModuleService {

    async createModule(courseId, moduleData, user) {
        if (user.rol !== 'ADMIN') {
            throw new ServerError('No tienes permisos para crear módulos', 403);
        }

        const course = await courseRepository.findById(courseId);
        if (!course || !course.activo) {
            throw new ServerError('El curso especificado no existe', 404);
        }

        const newModule = await moduleRepository.create(moduleData);

        course.modulos.push(newModule._id);

        await course.save();

        return newModule;
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
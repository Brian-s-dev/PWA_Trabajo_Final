import moduleService from '../services/module.service.js';

class ModuleController {

    async createModule(request, response, next) {
        try {
            const { course_id } = request.params;

            const moduleData = request.body;

            const newModule = await moduleService.createModule(course_id, moduleData, request.user);

            response.status(201).json({
                ok: true,
                message: 'Módulo agregado al curso exitosamente',
                data: newModule
            });
        } catch (error) {
            next(error);
        }
    }

    async updateModule(request, response, next) {
        try {
            const { module_id } = request.params;

            const moduleData = request.body;

            const updatedModule = await moduleService.updateModule(module_id, moduleData, request.user);

            response.status(200).json({
                ok: true,
                message: 'Módulo actualizado',
                data: updatedModule
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteModule(request, response, next) {
        try {
            const { module_id } = request.params;
            const isHardDelete = request.query.hard === 'true';

            await moduleService.deleteModule(module_id, request.user, isHardDelete);

            response.status(200).json({ ok: true, message: isHardDelete ? 'Módulo eliminado físicamente' : 'Módulo eliminado' });
        } catch (error) {
            next(error);
        }
    }

    async getCourseModules(request, response, next) {
        try {
            const { course_id } = request.params;

            const modules = await moduleService.getModulesByCourseId(course_id);

            response.status(200).json({
                ok: true,
                data: modules
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ModuleController();
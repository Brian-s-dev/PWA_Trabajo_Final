import moduleService from '../services/module.service.js';

class ModuleController {

    async createModule(request, response, next) {
        try {
            const { courseId } = request.params;

            const newModule = await moduleService.createModule(courseId, request.body, request.user);

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
            const { id } = request.params;
            const updatedModule = await moduleService.updateModule(id, request.body, request.user);

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
            const { id } = request.params;
            await moduleService.deleteModule(id, request.user);

            response.status(200).json({ ok: true, message: 'Módulo eliminado' });
        } catch (error) {
            next(error);
        }
    }
}

export default new ModuleController();
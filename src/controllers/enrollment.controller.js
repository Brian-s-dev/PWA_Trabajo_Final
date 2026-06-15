import enrollmentService from '../services/enrollment.service.js';

class EnrollmentController {

    async assignCourse(request, response, next) {
        try {
            const { empleadoId, cursoId } = request.body;

            const enrollment = await enrollmentService.assignCourse(empleadoId, cursoId, request.user);

            response.status(201).json({
                ok: true,
                message: 'Empleado inscripto al curso exitosamente',
                data: enrollment
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyCourses(request, response, next) {
        try {
            const enrollments = await enrollmentService.getMyCourses(request.user);

            response.status(200).json({
                ok: true,
                data: enrollments
            });
        } catch (error) {
            next(error);
        }
    }

    async markModuleCompleted(request, response, next) {
        try {
            const { id } = request.params;
            const { moduleId } = request.body;

            const updatedEnrollment = await enrollmentService.markModuleCompleted(id, moduleId, request.user);

            response.status(200).json({
                ok: true,
                message: 'Progreso del curso actualizado',
                data: updatedEnrollment
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new EnrollmentController();
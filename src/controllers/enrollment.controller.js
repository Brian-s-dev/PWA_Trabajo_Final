import enrollmentService from '../services/enrollment.service.js';

class EnrollmentController {

    async assignCourse(request, response, next) {
        try {
            const { employee_id, curso_id } = request.body;

            const enrollment = await enrollmentService.assignCourse(employee_id, curso_id, request.user);

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
            const { user_id } = request.params;

            const enrollments = await enrollmentService.getMyCourses(user_id);

            response.status(200).json({
                ok: true,
                data: enrollments
            });
        } catch (error) {
            next(error);
        }
    }

    async getCourseEnrollments(request, response, next) {
        try {
            const { course_id } = request.params;
            const enrollments = await enrollmentService.getEnrollmentsByCourse(course_id);

            response.status(200).json({
                ok: true,
                data: enrollments
            });
        } catch (error) {
            next(error);
        }
    }

    async getEmployeeCourses(request, response, next) {
        try {
            const { employee_id } = request.params;
            const enrollments = await enrollmentService.getEnrollmentsByEmployee(employee_id);

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
            const { course_id } = request.params;
            const { module_id } = request.body;

            const updatedEnrollment = await enrollmentService.markModuleCompleted(course_id, module_id, request.user);

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
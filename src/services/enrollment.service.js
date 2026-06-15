import enrollmentRepository from '../repositories/enrollment.repository.js';
import courseRepository from '../repositories/course.repository.js';
import userRepository from '../repositories/user.repository.js';
import ServerError from '../helpers/serverError.helper.js';

class EnrollmentService {

    async assignCourse(empleadoId, cursoId, user) {
        if (user.rol !== 'ADMIN') {
            throw new ServerError('Solo los administradores pueden asignar cursos', 403);
        }

        const course = await courseRepository.findById(cursoId);
        if (!course) throw new ServerError('El curso no existe', 404);

        const employee = await userRepository.findUserById(empleadoId);
        if (!employee) throw new ServerError('El empleado no existe', 404);

        const existingEnrollment = await enrollmentRepository.findByUserAndCourse(empleadoId, cursoId);
        if (existingEnrollment) {
            throw new ServerError('El empleado ya está inscrito en este curso', 400);
        }

        return await enrollmentRepository.create({ empleado: empleadoId, curso: cursoId });
    }

    async getMyCourses(user) {
        return await enrollmentRepository.findByUserId(user.id);
    }

    async markModuleCompleted(enrollmentId, moduleId, user) {
        const enrollment = await enrollmentRepository.findById(enrollmentId);
        if (!enrollment) throw new ServerError('Inscripción no encontrada', 404);

        if (enrollment.empleado.toString() !== user.id) {
            throw new ServerError('No tienes permiso para modificar este progreso', 403);
        }

        if (!enrollment.modulosCompletados.includes(moduleId)) {
            enrollment.modulosCompletados.push(moduleId);
            enrollment.estado = 'EN_PROGRESO';
            await enrollment.save();
        }

        return enrollment;
    }
}

export default new EnrollmentService();
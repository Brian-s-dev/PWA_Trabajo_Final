import enrollmentRepository from '../repositories/enrollment.repository.js';
import courseRepository from '../repositories/course.repository.js';
import userRepository from '../repositories/user.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import { ENROLLMENT_STATUS } from '../constants/enrollmentStatus.constant.js';
import { ROLES } from '../constants/roles.constant.js';

class EnrollmentService {

    async assignCourse(employee_id, course_id, user) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('Solo los administradores pueden asignar cursos', 403);
        }

        const course = await courseRepository.findById(course_id);
        if (!course) throw new ServerError('El curso no existe', 404);

        const employee = await userRepository.findUserById(employee_id);
        if (!employee) throw new ServerError('El empleado no existe', 404);

        const existingEnrollment = await enrollmentRepository.findByUserAndCourse(employee_id, course_id);
        if (existingEnrollment) {
            throw new ServerError('El empleado ya está inscrito en este curso', 400);
        }

        return await enrollmentRepository.create({ empleado: employee_id, curso: course_id });
    }

    async getMyCourses(user) {
        return await enrollmentRepository.findByUserId(user.id);
    }

    async getEnrollmentsByCourse(course_id) {
        return await enrollmentRepository.findByCursoId(course_id);
    }

    async getEnrollmentsByEmployee(employee_id) {
        return await enrollmentRepository.findByEmpleadoId(employee_id);
    }

    async markModuleCompleted(course_id, module_id, user) {
        const enrollment = await enrollmentRepository.findByUserAndCourse(user.id, course_id);
        if (!enrollment) throw new ServerError('Inscripción no encontrada', 404);

        const course = await courseRepository.findById(course_id);
        if (!course) throw new ServerError('Curso no encontrado', 404);

        if (!course.modulos.includes(module_id)) {
            throw new ServerError('El módulo no pertenece a este curso', 400);
        }

        if (!enrollment.modulosCompletados.includes(module_id)) {
            enrollment.modulosCompletados.push(module_id);

            if (enrollment.modulosCompletados.length >= course.modulos.length) {
                enrollment.estado = ENROLLMENT_STATUS.COMPLETADO;
            } else {
                enrollment.estado = ENROLLMENT_STATUS.EN_PROGRESO;
            }

            await enrollment.save();
        }

        return enrollment;
    }
}

export default new EnrollmentService();
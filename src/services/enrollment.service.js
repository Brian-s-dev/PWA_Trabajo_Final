import enrollmentRepository from '../repositories/enrollment.repository.js';
import courseRepository from '../repositories/course.repository.js';
import userRepository from '../repositories/user.repository.js';
import enrollmentModuleRepository from '../repositories/enrollmentModule.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import { ENROLLMENT_STATUS } from '../constants/enrollmentStatus.constant.js';
import { MODULE_STATUS } from '../constants/moduleStatus.constant.js';
import { ROLES } from '../constants/roles.constant.js';

class EnrollmentService {

    /**
     * Asigna un curso a un empleado (inscribe al empleado).
     * @param {string} employee_id - ID del empleado a inscribir.
     * @param {string} course_id - ID del curso.
     * @param {Object} user - Usuario administrador que realiza la acción.
     * @returns {Promise<Object>} La inscripción creada o reactivada.
     * @throws {ServerError} Si no hay permisos, el empleado no existe o el curso no existe.
     */
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
            if (existingEnrollment.activo) {
                throw new ServerError('El empleado ya está inscrito en este curso', 400);
            } else {
                existingEnrollment.activo = true;
                await existingEnrollment.save();

                if (course.modulos && course.modulos.length > 0) {
                    const existingModules = await enrollmentModuleRepository.findByEnrollmentId(existingEnrollment._id);
                    const existingModuleIds = existingModules.map(m => m.modulo.toString());

                    const newModulesData = course.modulos
                        .filter(modId => !existingModuleIds.includes(modId.toString()))
                        .map(moduloId => ({
                            enrollment: existingEnrollment._id,
                            modulo: moduloId,
                            estado: MODULE_STATUS.PENDIENTE
                        }));

                    if (newModulesData.length > 0) {
                        await enrollmentModuleRepository.createMany(newModulesData);
                    }
                }

                return existingEnrollment;
            }
        }

        const newEnrollment = await enrollmentRepository.create({ empleado: employee_id, curso: course_id });

        if (course.modulos && course.modulos.length > 0) {
            const modulesData = course.modulos.map(moduloId => ({
                enrollment: newEnrollment._id,
                modulo: moduloId,
                estado: MODULE_STATUS.PENDIENTE
            }));
            await enrollmentModuleRepository.createMany(modulesData);
        }

        return newEnrollment;
    }

    /**
     * Desasigna (da de baja lógicamente) a un empleado de un curso.
     * @param {string} employee_id - ID del empleado.
     * @param {string} course_id - ID del curso.
     * @param {Object} user - Usuario administrador que realiza la acción.
     * @returns {Promise<Object>} La inscripción actualizada a inactiva.
     * @throws {ServerError} Si no hay permisos o la inscripción no existe.
     */
    async unassignCourse(employee_id, course_id, user) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('Solo los administradores pueden desasignar cursos', 403);
        }

        const existingEnrollment = await enrollmentRepository.findByUserAndCourse(employee_id, course_id);
        if (!existingEnrollment || !existingEnrollment.activo) {
            throw new ServerError('La inscripción no existe o ya está inactiva', 404);
        }

        existingEnrollment.activo = false;
        await existingEnrollment.save();

        return existingEnrollment;
    }

    /**
     * Obtiene todos los cursos en los que el usuario actual está inscrito,
     * incluyendo el progreso de cada módulo.
     * @param {Object} user - Usuario que realiza la consulta.
     * @returns {Promise<Array>} Lista de inscripciones con el curso poblado y su progreso.
     */
    async getMyCourses(user) {
        const enrollments = await enrollmentRepository.findByUserId(user.id);
        const results = [];
        for (const enr of enrollments) {
            if (!enr.curso) continue;
            const enrObj = enr.toObject();
            const modulesProgress = await enrollmentModuleRepository.findByEnrollmentId(enr._id);
            enrObj.moduleProgress = modulesProgress;
            results.push(enrObj);
        }
        return results;
    }

    /**
     * Obtiene todas las inscripciones asociadas a un curso específico.
     * @param {string} course_id - ID del curso.
     * @returns {Promise<Array>} Lista de inscripciones.
     */
    async getEnrollmentsByCourse(course_id) {
        return await enrollmentRepository.findByCursoId(course_id);
    }

    /**
     * Obtiene todas las inscripciones de un empleado específico.
     * @param {string} employee_id - ID del empleado.
     * @returns {Promise<Array>} Lista de inscripciones.
     */
    async getEnrollmentsByEmployee(employee_id) {
        return await enrollmentRepository.findByEmpleadoId(employee_id);
    }

    /**
     * Marca un módulo específico como completado para un usuario en un curso.
     * También actualiza el estado general de la inscripción si todos los módulos se completan.
     * @param {string} course_id - ID del curso.
     * @param {string} module_id - ID del módulo a completar.
     * @param {Object} user - Usuario que completa el módulo.
     * @returns {Promise<Object>} La inscripción actualizada.
     * @throws {ServerError} Si la inscripción, curso o módulo no existen.
     */
    async markModuleCompleted(course_id, module_id, user) {
        const enrollment = await enrollmentRepository.findByUserAndCourse(user.id, course_id);
        if (!enrollment) throw new ServerError('Inscripción no encontrada', 404);

        const course = await courseRepository.findById(course_id);
        if (!course) throw new ServerError('Curso no encontrado', 404);

        const moduleExistsInCourse = course.modulos.some(mod => mod._id.toString() === module_id.toString());
        if (!moduleExistsInCourse) {
            throw new ServerError('El módulo no pertenece a este curso', 400);
        }

        const enrollmentModule = await enrollmentModuleRepository.findByEnrollmentAndModule(enrollment._id, module_id);
        if (!enrollmentModule) {
            throw new ServerError('No se encontró el seguimiento para este módulo', 404);
        }

        if (enrollmentModule.estado !== MODULE_STATUS.COMPLETADO) {
            await enrollmentModuleRepository.updateById(enrollmentModule._id, {
                estado: MODULE_STATUS.COMPLETADO,
                fechaCompletado: new Date()
            });

            if (enrollment.estado !== ENROLLMENT_STATUS.COMPLETADO) {
                const allModules = await enrollmentModuleRepository.findByEnrollmentId(enrollment._id);
                const completedCount = allModules.filter(m => m.estado === MODULE_STATUS.COMPLETADO).length;

                if (completedCount >= course.modulos.length) {
                    enrollment.estado = ENROLLMENT_STATUS.COMPLETADO;
                } else {
                    enrollment.estado = ENROLLMENT_STATUS.EN_PROGRESO;
                }

                await enrollment.save();
            }
        }

        return enrollment;
    }
}

export default new EnrollmentService();
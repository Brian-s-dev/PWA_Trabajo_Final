import courseRepository from '../repositories/course.repository.js';
import moduleRepository from '../repositories/module.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import { ROLES } from '../constants/roles.constant.js';

class CourseService {

    /**
     * Crea un nuevo curso.
     * @param {Object} courseData - Datos del curso a crear.
     * @param {Object} user - Usuario que realiza la petición (debe ser ADMIN o SUPERADMIN).
     * @returns {Promise<Object>} El curso creado.
     * @throws {ServerError} Si el usuario no tiene permisos.
     */
    async createCourse(courseData, user) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('No tienes permisos para crear cursos', 403);
        }

        courseData.creadoPor = user.id;

        return await courseRepository.create(courseData);
    }

    /**
     * Obtiene todos los cursos según los filtros de búsqueda.
     * @param {Object} query - Filtros de búsqueda (paginación, ordenamiento, etc).
     * @returns {Promise<Array>} Lista de cursos.
     */
    async getAllCourses(query) {
        return await courseRepository.findAll(query);
    }

    /**
     * Obtiene un curso específico por su ID.
     * @param {string} id - ID del curso.
     * @returns {Promise<Object>} El curso encontrado.
     * @throws {ServerError} Si el curso no existe o no está activo.
     */
    async getCourseById(id) {
        const course = await courseRepository.findById(id);

        if (!course || !course.activo) {
            throw new ServerError('Curso no encontrado o eliminado', 404);
        }

        return course;
    }

    /**
     * Actualiza la información de un curso existente.
     * @param {string} id - ID del curso a modificar.
     * @param {Object} updateData - Datos a actualizar en el curso.
     * @param {Object} user - Usuario que realiza la petición (debe ser ADMIN o SUPERADMIN).
     * @returns {Promise<Object>} El curso modificado.
     * @throws {ServerError} Si el usuario no tiene permisos o el curso no existe.
     */
    async updateCourse(id, updateData, user) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('No tienes permisos para modificar cursos', 403);
        }

        const updatedCourse = await courseRepository.updateById(id, updateData);
        if (!updatedCourse) {
            throw new ServerError('Curso no encontrado', 404);
        }

        return updatedCourse;
    }

    /**
     * Elimina un curso, ya sea lógicamente (soft delete) o físicamente (hard delete).
     * También elimina en cascada los módulos asociados.
     * @param {string} id - ID del curso a eliminar.
     * @param {Object} user - Usuario que realiza la petición (ADMIN para soft, SUPERADMIN para hard).
     * @param {boolean} [isHardDelete=false] - Indica si el borrado debe ser permanente.
     * @returns {Promise<Object>} El curso eliminado.
     * @throws {ServerError} Si no hay permisos o el curso no existe.
     */
    async deleteCourse(id, user, isHardDelete = false) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('No tienes permisos para eliminar cursos', 403);
        }

        let deletedCourse;
        if (isHardDelete) {
            if (user.rol !== ROLES.SUPERADMIN) {
                throw new ServerError('Solo un SUPERADMIN puede hacer borrado físico', 403);
            }
            deletedCourse = await courseRepository.hardDeleteById(id);
        } else {
            deletedCourse = await courseRepository.deleteById(id);
        }

        if (!deletedCourse) {
            throw new ServerError('Curso no encontrado', 404);
        }

        if (deletedCourse.modulos && deletedCourse.modulos.length > 0) {
            await Promise.all(deletedCourse.modulos.map(moduleId =>
                isHardDelete ? moduleRepository.hardDeleteById(moduleId) : moduleRepository.deleteById(moduleId)
            ));
        }

        return deletedCourse;
    }
}

export default new CourseService();

import courseRepository from '../repositories/course.repository.js';
import moduleRepository from '../repositories/module.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import { ROLES } from '../constants/roles.constant.js';

class CourseService {

    async createCourse(courseData, user) {
        if (user.rol !== ROLES.ADMIN && user.rol !== ROLES.SUPERADMIN) {
            throw new ServerError('No tienes permisos para crear cursos', 403);
        }

        courseData.creadoPor = user.id;

        return await courseRepository.create(courseData);
    }

    async getAllCourses() {
        return await courseRepository.findAll();
    }

    async getCourseById(id) {
        const course = await courseRepository.findById(id);

        if (!course || !course.activo) {
            throw new ServerError('Curso no encontrado o eliminado', 404);
        }

        return course;
    }

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

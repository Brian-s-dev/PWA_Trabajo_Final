import courseService from '../services/course.service.js';

class CourseController {

    async createCourse(request, response, next) {
        try {
            const newCourse = await courseService.createCourse(request.body, request.user);

            response.status(201).json({
                ok: true,
                message: 'Curso creado exitosamente',
                data: newCourse
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllCourses(request, response, next) {
        try {
            const courses = await courseService.getAllCourses();

            response.status(200).json({
                ok: true,
                data: courses
            });
        } catch (error) {
            next(error);
        }
    }

    async getCourseById(request, response, next) {
        try {
            const { id } = request.params;
            const course = await courseService.getCourseById(id);

            response.status(200).json({
                ok: true,
                data: course
            });
        } catch (error) {
            next(error);
        }
    }

    async updateCourse(request, response, next) {
        try {
            const { id } = request.params;
            const updatedCourse = await courseService.updateCourse(id, request.body, request.user);

            response.status(200).json({
                ok: true,
                message: 'Curso actualizado exitosamente',
                data: updatedCourse
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteCourse(request, response, next) {
        try {
            const { id } = request.params;
            const isHardDelete = request.query.hard === 'true';
            await courseService.deleteCourse(id, request.user, isHardDelete);

            response.status(200).json({
                ok: true,
                message: isHardDelete ? 'Curso eliminado físicamente' : 'Curso eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CourseController();
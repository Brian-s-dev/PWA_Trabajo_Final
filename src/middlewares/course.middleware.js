import courseRepository from '../repositories/course.repository.js';
import ServerError from '../helpers/serverError.helper.js';

export const verifyCourseExists = async (request, response, next) => {
    try {
        const course_id = request.params.course_id || request.params.id;

        if (!course_id) {
            throw new ServerError('No se proporcionó el ID del curso en la URL', 400);
        }

        const course = await courseRepository.findById(course_id);

        if (!course) {
            throw new ServerError('El curso solicitado no existe o fue eliminado', 404);
        }

        request.course = course;

        next();
    } catch (error) {
        next(error);
    }
};
import Course from '../models/course.model.js';

class CourseRepository {
    async create(courseData) {
        return await Course.create(courseData);
    }

    async findAll(query = {}) {
        const filter = {};
        if (query.includeInactive !== 'true') {
            filter.activo = true;
        }
        return await Course.find(filter)
            .populate('creadoPor', 'nombre email')
            .populate('modulos', 'titulo activo');
    }

    async findById(id) {
        return await Course.findById(id)
            .populate('creadoPor', 'nombre email')
            .populate('modulos');
    }

    async updateById(id, updateData) {
        return await Course.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteById(id) {
        return await Course.findByIdAndUpdate(id, { activo: false }, { new: true });
    }

    async hardDeleteById(id) {
        return await Course.findByIdAndDelete(id);
    }
}

export default new CourseRepository();
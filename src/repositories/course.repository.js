import Course from '../models/course.model.js';

class CourseRepository {
    async create(courseData) {
        return await Course.create(courseData);
    }

    async findAll() {
        return await Course.find({ activo: true }).populate('creadoPor', 'nombre email');
    }

    async findById(id) {
        return await Course.findById(id).populate('creadoPor', 'nombre email');
    }

    async updateById(id, updateData) {
        return await Course.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteById(id) {
        return await Course.findByIdAndUpdate(id, { activo: false }, { new: true });
    }
}

export default new CourseRepository();
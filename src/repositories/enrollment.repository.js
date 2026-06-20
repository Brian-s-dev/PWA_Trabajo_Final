import Enrollment from '../models/enrollment.model.js';

class EnrollmentRepository {
    async create(data) {
        return await Enrollment.create(data);
    }

    async findByUserAndCourse(employee_id, course_id) {
        return await Enrollment.findOne({ empleado: employee_id, curso: course_id });
    }

    async findByUserId(employee_id) {
        return await Enrollment.find({ empleado: employee_id }).populate('curso');
    }

    async findById(id) {
        return await Enrollment.findById(id);
    }
}

export default new EnrollmentRepository();
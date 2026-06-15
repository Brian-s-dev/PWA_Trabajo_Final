import Enrollment from '../models/enrollment.model.js';

class EnrollmentRepository {
    async create(data) {
        return await Enrollment.create(data);
    }

    async findByUserAndCourse(empleadoId, cursoId) {
        return await Enrollment.findOne({ empleado: empleadoId, curso: cursoId });
    }

    async findByUserId(empleadoId) {
        return await Enrollment.find({ empleado: empleadoId }).populate('curso');
    }

    async findById(id) {
        return await Enrollment.findById(id);
    }
}

export default new EnrollmentRepository();
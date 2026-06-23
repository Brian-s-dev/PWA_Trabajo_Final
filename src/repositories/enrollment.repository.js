import Enrollment from '../models/enrollment.model.js';

class EnrollmentRepository {
    async create(data) {
        return await Enrollment.create(data);
    }

    async findByUserAndCourse(empleado_id, curso_id) {
        return await Enrollment.findOne({ empleado: empleado_id, curso: curso_id });
    }

    async findByUserId(empleado_id) {
        return await Enrollment.find({ empleado: empleado_id }).populate('curso').populate('modulosCompletados');
    }

    async findByCursoId(curso_id) {
        return await Enrollment.find({ curso: curso_id }).populate('empleado', 'nombre email');
    }

    async findByEmpleadoId(empleado_id) {
        return await Enrollment.find({ empleado: empleado_id }).populate('curso').populate('modulosCompletados');
    }

    async findById(id) {
        return await Enrollment.findById(id);
    }
}

export default new EnrollmentRepository();
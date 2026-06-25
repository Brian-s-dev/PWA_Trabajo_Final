import Enrollment from '../models/enrollment.model.js';

class EnrollmentRepository {
    async create(data) {
        return await Enrollment.create(data);
    }

    async findByUserAndCourse(empleado_id, curso_id) {
        return await Enrollment.findOne({ empleado: empleado_id, curso: curso_id });
    }

    async findByUserId(empleado_id) {
        return await Enrollment.find({ empleado: empleado_id, activo: true }).populate({
            path: 'curso',
            match: { activo: true },
            populate: { path: 'modulos' }
        });
    }

    async findByCursoId(curso_id) {
        return await Enrollment.find({ curso: curso_id, activo: true }).populate('empleado', 'nombre email');
    }

    async findByEmpleadoId(empleado_id) {
        return await Enrollment.find({ empleado: empleado_id, activo: true }).populate({
            path: 'curso',
            match: { activo: true },
            populate: { path: 'modulos' }
        });
    }

    async findById(id) {
        return await Enrollment.findOne({ _id: id, activo: true });
    }
}

export default new EnrollmentRepository();
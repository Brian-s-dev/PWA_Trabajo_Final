import EnrollmentModule from '../models/enrollmentModule.model.js';

class EnrollmentModuleRepository {
    async createMany(dataArray) {
        return await EnrollmentModule.insertMany(dataArray);
    }

    async findByEnrollmentId(enrollment_id) {
        return await EnrollmentModule.find({ enrollment: enrollment_id });
    }

    async findByEnrollmentAndModule(enrollment_id, modulo_id) {
        return await EnrollmentModule.findOne({ enrollment: enrollment_id, modulo: modulo_id });
    }

    async updateById(id, updateData) {
        return await EnrollmentModule.findByIdAndUpdate(id, updateData, { new: true });
    }
}

export default new EnrollmentModuleRepository();

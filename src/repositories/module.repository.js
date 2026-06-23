import Module from '../models/module.model.js';

class ModuleRepository {
    async create(moduleData) {
        return await Module.create(moduleData);
    }

    async findById(id) {
        return await Module.findById(id);
    }

    async findByCourseId(course_id) {
        return await Module.find({ curso_id: course_id, activo: true });
    }

    async updateById(id, updateData) {
        return await Module.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteById(id) {
        return await Module.findByIdAndUpdate(id, { activo: false }, { new: true });
    }

    async hardDeleteById(id) {
        return await Module.findByIdAndDelete(id);
    }
}

export default new ModuleRepository();
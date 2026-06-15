import Module from '../models/module.model.js';

class ModuleRepository {
    async create(moduleData) {
        return await Module.create(moduleData);
    }

    async findById(id) {
        return await Module.findById(id);
    }

    async updateById(id, updateData) {
        return await Module.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteById(id) {
        return await Module.findByIdAndUpdate(id, { activo: false }, { new: true });
    }
}

export default new ModuleRepository();
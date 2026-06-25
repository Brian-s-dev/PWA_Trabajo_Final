import User from '../models/user.model.js';

class UserRepository {
    async createUser(userData) {
        return await User.create(userData);
    }

    async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    async findUserById(id) {
        return await User.findById(id);
    }

    async updateById(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async findAllUsers(query = {}) {
        const filter = {};
        if (query.includeInactive !== 'true') {
            filter.activo = true;
        }
        if (query.search) {
            filter.$or = [
                { nombre: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } }
            ];
        }
        return await User.find(filter).select('-password');
    }

    async deleteById(id) {
        return await User.findByIdAndUpdate(id, { activo: false }, { new: true });
    }

    async hardDeleteById(id) {
        return await User.findByIdAndDelete(id);
    }
}
export default new UserRepository();
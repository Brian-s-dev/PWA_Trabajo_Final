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
        // PREGUNTAR POR SINTAXIS 
        const filter = { activo: true };
        if (query.search) {
            filter.$or = [
                { nombre: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } }
            ];
        }
        return await User.find(filter).select('-password');
    }

    /* async findAllUsers(query = {}) {
        let users = await User.find({ activo: true }).select('-password');

        if (query.search) {
            
            const terminoDeBusqueda = query.search.toLowerCase();

            users = users.filter(usuario => {
                
                const nombreUsuario = usuario.nombre.toLowerCase();
                const emailUsuario = usuario.email.toLowerCase();

                return nombreUsuario.includes(terminoDeBusqueda) || emailUsuario.includes(terminoDeBusqueda);
            });
        }
        return users;
    } */

    async deleteById(id) {
        return await User.findByIdAndUpdate(id, { activo: false }, { new: true });
    }

    async hardDeleteById(id) {
        return await User.findByIdAndDelete(id);
    }
}
export default new UserRepository();
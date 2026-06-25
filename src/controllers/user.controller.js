import userService from '../services/user.service.js';

class UserController {
    async getAllUsers(request, response, next) {
        try {
            const users = await userService.getAllUsers(request.query);
            response.status(200).json({ ok: true, data: users });
        } catch (error) {
            next(error);
        }
    }

    async createUser(request, response, next) {
        try {
            const newUser = await userService.createUser(request.body, request.user);
            response.status(201).json({
                ok: true,
                message: 'Usuario creado exitosamente',
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(request, response, next) {
        try {
            const { id } = request.params;
            const updatedUser = await userService.updateUser(id, request.body, request.user);
            response.status(200).json({ ok: true, message: 'Usuario actualizado exitosamente', data: updatedUser });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(request, response, next) {
        try {
            const { id } = request.params;
            const isHardDelete = request.query.hard === 'true';

            const result = await userService.deleteUser(id, request.user, isHardDelete);

                        response.status(200).json({ ok: true, message: result.message });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();

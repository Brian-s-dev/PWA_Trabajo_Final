import authService from '../services/auth.service.js';

class AuthController {

    async register(request, response, next) {
        try {
            const { nombre, email, password } = request.body;

            const newUser = await authService.register(nombre, email, password);

            return response.status(201).json({
                ok: true,
                message: 'Usuario registrado con éxito. Por favor verifica tu casilla de correo.',
                data: {
                    id: newUser._id,
                    nombre: newUser.nombre,
                    email: newUser.email,
                    rol: newUser.rol,
                    email_verificado: newUser.email_verificado
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(request, response, next) {
        try {
            const { verification_token } = request.query;

            await authService.verifyEmail(verification_token);

            return response.status(200).json({
                ok: true,
                message: "Correo verificado con éxito"
            });
        } catch (error) {
            next(error);
        }
    }

    async login(request, response, next) {
        try {
            const { email, password } = request.body;

            const data = await authService.login(email, password);

            return response.status(200).json({
                ok: true,
                message: "Inicio de sesión exitoso",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }

    async getMe(request, response, next) {
        try {
            response.status(200).json({
                ok: true,
                data: request.user
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMe(request, response, next) {
        try {
            const updatedUser = await authService.updateMe(request.user.id, request.body);

            response.status(200).json({
                ok: true,
                message: 'Perfil actualizado exitosamente',
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAvatar(request, response, next) {
        try {
            if (!request.file) {
                return response.status(400).json({ ok: false, message: 'No se subió ninguna imagen' });
            }

            const avatarUrl = `/uploads/avatars/${request.file.filename}`;

            const updatedUser = await authService.updateAvatar(request.user.id, avatarUrl);

            response.status(200).json({
                ok: true,
                message: 'Avatar actualizado exitosamente',
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(request, response, next) {
        try {
            const { email } = request.body;
            await authService.forgotPassword(email);

            response.status(200).json({
                ok: true,
                message: 'Si el correo existe, se enviará un enlace de recuperación.'
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(request, response, next) {
        try {
            const { reset_token, new_password } = request.body;
            await authService.resetPassword(reset_token, new_password);

            response.status(200).json({
                ok: true,
                message: 'Contraseña restablecida exitosamente.'
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new AuthController();
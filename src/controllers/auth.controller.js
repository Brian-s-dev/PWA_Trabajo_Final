import authService from '../services/auth.service.js';

class AuthController {

    async register(request, response, next) {
        try {
            const { nombre, email, password, rol } = request.body;

            const newUser = await authService.register(nombre, email, password, rol);

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

}

export default new AuthController();
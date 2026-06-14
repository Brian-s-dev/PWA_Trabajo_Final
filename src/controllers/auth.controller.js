import authService from '../services/auth.service.js';

export const registerUser = async (req, res, next) => {
    try {
        const newUser = await authService.register(req.body);

        res.status(201).json({
            ok: true,
            message: 'Usuario registrado con éxito. Por favor verifica tu casilla de correo.',
            data: {
                id: newUser._id,
                nombre: newUser.nombre,
                email: newUser.email,
                verificado: newUser.verificado
            }
        });
    } catch (error) {
        next(error);
    }
};
export const validateRegisterInput = (request, response, next) => {
    const { nombre, email, password } = request.body || {};

    if (!nombre || !email || !password) {
        return response.status(400).json({ ok: false, message: 'Nombre, email y password son obligatorios.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return response.status(400).json({ ok: false, message: 'El formato del correo electrónico no es válido.' });
    }

    if (password.length < 6) {
        return response.status(400).json({ ok: false, message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    next();
};
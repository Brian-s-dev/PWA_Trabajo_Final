import { ROLES } from '../constants/roles.constant.js';
import ServerError from '../helpers/serverError.helper.js';

export const roleMiddleware = (allowedRoles) => {
    return (request, response, next) => {
        try {
            if (!request.user) {
                throw new ServerError('Usuario no autenticado', 401);
            }

            if (!allowedRoles.includes(request.user.rol)) {
                throw new ServerError('Acceso denegado. No tienes los permisos necesarios.', 403);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import ServerError from '../helpers/serverError.helper.js';

export const authMiddleware = (request, response, next) => {
    try {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) throw new ServerError('No se proporcionó token de autenticación', 401);

        const authorization_token = authorizationHeader.split(' ')[1];
        if (!authorization_token) throw new ServerError('Formato de token inválido', 401);

        const user_info = jwt.verify(
            authorization_token,
            ENVIRONMENT.JWT_SECRET
        );

        request.user = user_info;

        next();
    } catch (error) {
        next(error);
    }
};
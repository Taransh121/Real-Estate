import jwt from 'jsonwebtoken';
import { errorHandler } from './Error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // console.log(token);

    if (!token) return next(errorHandler(401, 'Unauthorizedd'));

    jwt.verify(token, process.env.Jwt_Token, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden'));

        req.user = user;
        next();
    });
};
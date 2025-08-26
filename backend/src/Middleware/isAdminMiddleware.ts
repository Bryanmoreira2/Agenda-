// middlewares/is-admin.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UserModel } from '../models/UserModel';

export async function isAdminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded: any = jwt.verify(token, String(process.env.JWT_SECRET));
        const user = await UserModel.findById(decoded.id);

        if (!user || !user.isAdmin) {
            return res
                .status(403)
                .json({ error: 'Acesso negado: apenas administradores' });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

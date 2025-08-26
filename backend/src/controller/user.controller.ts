import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { UserModel } from '../models/UserModel';
import { buildValidationErroMessagen } from '../utils/build-validation-error-message.util';

export class UserController {
    create = async (request: Request, response: Response) => {
        const Schema = z.object({
            name: z.string().min(1, 'Nome é obrigatório'),
            email: z.string().email('Email inválido'),
            password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
            isAdmin: z.boolean().optional(),
        });

        const parsed = Schema.safeParse(request.body);

        if (!parsed.success) {
            const errors = buildValidationErroMessagen(parsed.error.issues);
            return response.status(400).json({ message: errors });
        }

        const { name, email, password, isAdmin } = parsed.data;

        try {
            const userExists = await UserModel.findOne({ email });
            if (userExists) {
                return response.status(400).json({ message: 'Usuário já existe.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserModel.create({
                name,
                email,
                password: hashedPassword,
                isAdmin: isAdmin ?? false,
            });

            return response.status(201).json(user);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao criar usuário.' });
        }
    };
    login = async (request: Request, response: Response) => {
        const { JWT_SECRET: secret, JWT_EXPIRES_IN: expiresIn } = process.env;

        const Schema = z.object({
            email: z.string().email('Email inválido'),
            password: z.string().min(1, 'Senha é obrigatória'),
        });

        const parsed = Schema.safeParse(request.body);

        if (!parsed.success) {
            const errors = buildValidationErroMessagen(parsed.error.issues);
            return response.status(400).json({ error: errors });
        }

        const { email, password } = parsed.data;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return response
                    .status(400)
                    .json({ message: 'O email ou senha está incorreto' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return response
                    .status(400)
                    .json({ message: 'O email ou senha está incorreto' });
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
                String(secret),
                { expiresIn },
            );

            return response.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: ['Erro ao realizar login.'] });
        }
    };
}

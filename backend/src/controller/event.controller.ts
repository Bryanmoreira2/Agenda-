import { Request, Response } from 'express';
import { z } from 'zod';

import { EventModel } from '../models/EventModel';
import { buildValidationErroMessagen } from '../utils/build-validation-error-message.util';

const categoryColors: Record<string, string> = {
    Culto: 'blue',
    Reunião: 'magenta',
    Estudo: 'orange',
    Ensaio: 'teal',
    'Evento Especial': 'green',
    Outro: 'gray',
};

const eventSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    date: z.coerce.date({ required_error: 'Data é obrigatória' }),
    time: z.string().min(1, 'Horário é obrigatório'),
    location: z.string().min(1, 'Local é obrigatório'),
    description: z.string().optional(),
    category: z.enum(
        ['Culto', 'Reunião', 'Estudo', 'Ensaio', 'Evento Especial', 'Outro'],
        {
            required_error: 'Categoria é obrigatória',
        },
    ),
});

export class EventController {
    create = async (req: Request, res: Response) => {
        const parsed = eventSchema.safeParse(req.body);

        if (!parsed.success) {
            const errors = buildValidationErroMessagen(parsed.error.issues);
            return res.status(400).json({ error: errors.join(', ') });
        }

        const { title, date, time, location, description, category } =
            parsed.data;

        try {
            const existingEvent = await EventModel.findOne({ date });

            if (existingEvent) {
                return res
                    .status(400)
                    .json({ error: 'Já existe um evento nessa data.' });
            }

            const createdBy = req.user.name;
            const color = categoryColors[category];

            const event = await EventModel.create({
                title,
                date,
                time,
                location,
                description,
                createdBy,
                category,
                color,
            });

            return res.status(201).json(event);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar evento.' });
        }
    };

    listAll = async (req: Request, res: Response) => {
        try {
            const events = await EventModel.find()
                .sort({ date: 1, time: 1 })
                .lean();

            const result = events.map(
                ({
                    title,
                    date,
                    time,
                    location,
                    createdBy,
                    _id,
                    category,
                    color,
                }) => ({
                    id: _id,
                    title,
                    data: date.toISOString().split('T')[0],
                    horario: time,
                    local: location,
                    criado: createdBy,
                    categoria: category,
                    cor: color,
                }),
            );

            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            return res.status(500).json({ error: 'Erro ao listar eventos.' });
        }
    };

    listByUser = async (req: Request, res: Response) => {
        try {
            const userName = req.user?.name;

            if (!userName) {
                return res
                    .status(401)
                    .json({ error: 'Usuário não autenticado.' });
            }

            const events = await EventModel.find({ createdBy: userName })
                .sort({ date: 1, time: 1 })
                .lean();

            const result = events.map(
                ({
                    title,
                    date,
                    time,
                    location,
                    _id,
                    description,
                    category,
                    color,
                }) => ({
                    id: _id,
                    titulo: title,
                    data: date.toISOString().split('T')[0],
                    horario: time,
                    local: location,
                    descricao: description,
                    categoria: category,
                    cor: color,
                    criado: userName,
                }),
            );

            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao listar eventos do usuário:', error);
            return res
                .status(500)
                .json({ error: 'Erro ao listar eventos do usuário.' });
        }
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params;

        const parsed = eventSchema.safeParse(req.body);

        if (!parsed.success) {
            const errors = parsed.error.issues.map((issue) => issue.message);
            return res.status(400).json({ error: errors.join(', ') });
        }

        const { title, date, time, location, description, category } =
            parsed.data;

        try {
            const event = await EventModel.findById(id);

            if (!event) {
                return res
                    .status(404)
                    .json({ error: 'Evento não encontrado.' });
            }

            if (event.createdBy !== req.user?.name) {
                return res.status(403).json({
                    error: 'Você não tem permissão para editar este evento.',
                });
            }

            // Verificar conflitos de eventos na mesma data
            const conflictingEvent = await EventModel.findOne({
                date: date,
                _id: { $ne: id }, // Exclui o evento sendo atualizado
            });

            if (conflictingEvent) {
                return res.status(400).json({
                    error: 'Não é possível editar o evento, pois já existe um evento no mesmo dia.',
                });
            }

            // Atualizar o evento
            event.title = title;
            event.date = date;
            event.time = time;
            event.location = location;
            event.description = description;
            event.category = category;
            event.color = categoryColors[category];

            await event.save();

            return res.status(200).json(event);
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            return res.status(500).json({ error: 'Erro ao atualizar evento.' });
        }
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const event = await EventModel.findById(id);

            if (!event) {
                return res
                    .status(404)
                    .json({ error: 'Evento não encontrado.' });
            }

            if (event.createdBy !== req.user?.name) {
                return res.status(403).json({
                    error: 'Você não tem permissão para excluir este evento.',
                });
            }

            await EventModel.findByIdAndDelete(id);

            return res
                .status(200)
                .json({ message: 'Evento excluído com sucesso.' });
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            return res.status(500).json({ error: 'Erro ao excluir evento.' });
        }
    };
    getEventById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const event = await EventModel.findById(id).lean();

            if (!event) {
                return res
                    .status(404)
                    .json({ error: 'Evento não encontrado.' });
            }

            const result = {
                id: event._id,
                title: event.title,
                data: event.date.toISOString().split('T')[0],
                horario: event.time,
                local: event.location,
                descricao: event.description,
                categoria: event.category,
                cor: event.color,
                criado: event.createdBy,
            };

            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao buscar evento:', error);
            return res.status(500).json({ error: 'Erro ao buscar evento.' });
        }
    };
}

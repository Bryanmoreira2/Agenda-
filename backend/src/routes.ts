import { Router } from 'express';

import packageJson from '../package.json';
import { EventController } from './controller/event.controller';
import { UserController } from './controller/user.controller';
import { authenticate } from './Middleware/authenticate';
import { isAdminMiddleware } from './Middleware/isAdminMiddleware';

export const router = Router();

const userControler = new UserController();
const eventController = new EventController();

// 🟢 Rota pública de status
router.get('/', (request, response) => {
    const { name, description, version } = packageJson;
    return response.status(200).json({ name, description, version });
});

// 🟢 Rotas públicas (login e registro)
router.post('/user', userControler.create);
router.post('/login', userControler.login);

// 🟢 Listar eventos públicos (se aplicável)
router.get('/events', eventController.listAll);

// 🔒 Rotas protegidas — requer token JWT
router.use(authenticate);

// 🟡 Rotas acessíveis por qualquer usuário autenticado
router.get('/myevents', eventController.listByUser);

// 🔐 Rotas que exigem token + ser administrador
router.post('/events', isAdminMiddleware, eventController.create);
router.put('/events/:id', isAdminMiddleware, eventController.update);
router.delete('/events/:id', isAdminMiddleware, eventController.delete);
router.get('/events/:id', isAdminMiddleware, eventController.getEventById);

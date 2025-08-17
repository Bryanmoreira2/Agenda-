import { createBrowserRouter } from 'react-router-dom';

import { AdminHome } from '../pages/AdminHome/AdminHomePage';
import { Edite } from '../pages/EditEvent/Edite';
import { LeanderHome } from '../pages/LeaderHome';
import { Login } from '../pages/Login/Login';
import { Myevents } from '../pages/MyEvents';
import { Events } from '../pages/NewAgenda/NewAgenda';
import { PrivateRoute } from './private-route';

export const router = createBrowserRouter([
    {
        path: '/admin',
        element: <PrivateRoute component={<AdminHome />} />,
    },
    {
        path: '/eventos',
        element: <PrivateRoute component={<Myevents />} />,
    },
    {
        path: '/',
        element: <PrivateRoute component={<LeanderHome />} />,
    },
    {
        path: '/agendamento',
        element: <PrivateRoute component={<Events />} />,
    },
    // Atualização da rota de edição para incluir o id do evento
    {
        path: '/editar/:id', // Adiciona o parâmetro id à URL
        element: <PrivateRoute component={<Edite />} />,
    },
    {
        path: '/login',
        element: <Login />,
    },
]);

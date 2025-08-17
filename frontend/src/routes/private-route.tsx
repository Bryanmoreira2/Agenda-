import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { AppContainer } from '../components/app-container';
import { Sidebar } from '../components/Sidebar';
import { USER_STORAGE_KEY } from '../hook/use-user';

type PrivateRouteProps = {
    component: ReactNode;
};

export function PrivateRoute({ component }: PrivateRouteProps) {
    const userData = localStorage.getItem(USER_STORAGE_KEY);

    if (!userData) {
        return <Navigate to="/login" />;
    }
    return (
        <AppContainer>
            <Sidebar />
            {component}
        </AppContainer>
    );
}

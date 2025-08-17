import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import { api } from '../service/api';

export type UserData = {
    id: string;
    name: string;
    email: string;
    password?: string;
    isAdmin: boolean;
    token: string;
};

type UserContextProps = {
    userData: UserData | null;
    getUserInfo: (
        e: React.FormEvent,
        email: string,
        password: string,
    ) => Promise<UserData>;
    logout: () => void;
};

type UserProviderProps = {
    children: ReactNode;
};
const STORAGE_KEY = import.meta.env.VITE_LOCALSTORAGE_KEY;

export const USER_STORAGE_KEY = `${STORAGE_KEY}:user`;

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
    const [userData, setUserData] = useState<UserData | null>(() => {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    });

    async function getUserInfo(
        e: React.FormEvent,
        email: string,
        password: string,
    ): Promise<UserData> {
        e.preventDefault();

        const { data } = await api.post<UserData>('/login', {
            email,
            password,
        });

        // Remover senha por segurança
        const { password: _, ...safeData } = data;

        setUserData(safeData as UserData);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeData));

        return safeData as UserData;
    }

    function logout() {
        localStorage.removeItem(USER_STORAGE_KEY);
        setUserData(null); // Melhor usar null em vez de {} as UserData
    }

    return (
        <UserContext.Provider value={{ userData, getUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser deve ser usado dentro de UserProvider');
    }
    return context;
}

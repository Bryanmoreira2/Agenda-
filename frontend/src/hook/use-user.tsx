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

// Tipo para os dados de registro
export type RegisterData = {
    name: string;
    email: string;
    password: string;
};

// Tipo para resposta de registro
export type RegisterResponse = {
    success: boolean;
    message: string;
    user?: Omit<UserData, 'password'>;
};

type UserContextProps = {
    userData: UserData | null;
    getUserInfo: (
        e: React.FormEvent,
        email: string,
        password: string,
    ) => Promise<UserData>;
    registerUser: (registerData: RegisterData) => Promise<RegisterResponse>;
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

    async function registerUser(
        registerData: RegisterData,
    ): Promise<RegisterResponse> {
        try {
            const { data } = await api.post('/user', registerData);

            return {
                success: true,
                message: 'Conta criada com sucesso!',
                user: data,
            };
        } catch (error: any) {
            // Tratamento de erros específicos do backend
            if (error.response?.data?.message) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }

            // Tratamento de erros de rede ou outros
            return {
                success: false,
                message: 'Erro ao criar conta. Tente novamente.',
            };
        }
    }

    function logout() {
        localStorage.removeItem(USER_STORAGE_KEY);
        setUserData(null);
    }

    return (
        <UserContext.Provider
            value={{
                userData,
                getUserInfo,
                registerUser,
                logout,
            }}
        >
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

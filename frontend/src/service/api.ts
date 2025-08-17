import axios from 'axios';

import { USER_STORAGE_KEY } from '../hook/use-user';
const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: apiUrl,
});
api.interceptors.request.use((config) => {
    const useDate = localStorage.getItem(USER_STORAGE_KEY); // Pega dados do localStorage
    const token = useDate && JSON.parse(useDate).token; // Extrai o token

    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Adiciona token no header
    }

    return config; // Retorna config com ou sem token
});

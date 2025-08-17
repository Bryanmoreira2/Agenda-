import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5555, // Defina a porta aqui
    },
    define: {
        'process.env': {}, // Adicionado para evitar ReferenceError
    },
});

import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { setupMongo } from './database';
import { router } from './routes'; // ✅ Correto para exportação com nome

const app = express();
const port = 5002;

setupMongo().then(() => {
    app.use(cors()); // ✅ Middleware
    app.use(express.json());
    app.use(router); // ✅ Middleware válido

    app.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
    });
});

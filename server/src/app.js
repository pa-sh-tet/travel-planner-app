import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth-routes.js';
import tripsRouter from './routes/trips-routes.js';
import { auth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { env } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.use('/static', express.static(path.resolve(__dirname, '../static')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/trips', auth, tripsRouter);

app.use(notFound);
app.use(errorHandler);

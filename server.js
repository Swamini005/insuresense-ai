import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Load backend/.env ──────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, 'backend', '.env') });

import knex from './backend/db/knex.js';
import authRoutes from './backend/routes/auth.routes.js';
import mastraRoutes from './backend/routes/mastra.routes.js';
import healthRoutes from './backend/routes/health.routes.js';
import travelRoutes from './backend/routes/travel.routes.js';
import investmentRoutes from './backend/routes/investment.routes.js';
import lifeRoutes from './backend/routes/life.routes.js';
import cryptoRoutes from './backend/routes/crypto.routes.js';
import chatRoutes from './backend/routes/chat.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS ───────────────────────────────────────────────────
// CORS_ORIGIN may be a comma-separated list (e.g. prod Vercel URL + local dev).
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

// Database Connection (Postgres via Knex)
knex.raw('select 1')
    .then(() => console.log('✅ Postgres connected'))
    .catch(err => console.error('❌ Postgres connection error:', err.message));

// Healthcheck (used by Coolify/load balancers — must not depend on auth or DB)
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => res.json({ status: 'InsureSense API running' }));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/mastra', mastraRoutes); // Commenting out until mastra is fully setup if needed, or keep it.
app.use('/api/health', healthRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/life', lifeRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 CORS origins: ${CORS_ORIGINS.join(', ')}`);
});

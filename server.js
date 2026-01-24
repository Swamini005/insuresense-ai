import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mastraRoutes from './backend/routes/mastra.routes.js';
import healthRoutes from './backend/routes/health.routes.js';
import travelRoutes from './backend/routes/travel.routes.js';
import investmentRoutes from './backend/routes/investment.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insuresense')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/mastra', mastraRoutes);
app.use('/health', healthRoutes); // Backend health check
app.use('/api/travel', travelRoutes);
app.use('/api/investment', investmentRoutes);

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
});

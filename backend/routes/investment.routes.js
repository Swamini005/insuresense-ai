import express from 'express';
import { fetchAndIngestInvestmentNews, migrateInvestmentJsonToMongo } from '../webhook/investment.webhook.js';
import { InvestmentAgent } from '../agent/investment.agent.js';

const router = express.Router();

router.get('/webhook', fetchAndIngestInvestmentNews); // Trigger ingestion
router.get('/migrate', migrateInvestmentJsonToMongo); // Trigger manual migration from JSON
router.post('/chat', InvestmentAgent); // Chat with agent

router.get('/', (req, res) => {
    res.json({ message: 'Investment route ready' });
});

export default router;
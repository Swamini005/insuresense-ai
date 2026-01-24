import express from 'express';
import { handleMastraChat, addMemory } from '../controllers/mastra.controller.js';

const router = express.Router();

router.post('/chat', handleMastraChat);
router.post('/memory', addMemory);

router.get('/', (req, res) => {
    res.json({ message: 'Mastra agent route working' });
});

export default router;

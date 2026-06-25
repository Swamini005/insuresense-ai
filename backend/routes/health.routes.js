import express from 'express';
import * as healthController from '../controllers/health.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/healthdetails', authenticate, healthController.postHealthDetails);
router.put('/healthdetails', authenticate, healthController.updateHealthDetails);
router.get('/healthinsurancenews', healthController.getNewsInsights);
router.post('/chat', authenticate, healthController.queryHealthChat);
router.post('/recommendations', authenticate, healthController.queryHealthRecommendations);

export default router;

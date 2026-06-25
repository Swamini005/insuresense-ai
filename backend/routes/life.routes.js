import express from 'express';
import * as lifeController from '../controllers/life.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/lifedetails', authenticate, lifeController.postLifeDetails);
router.put('/lifedetails', authenticate, lifeController.updateLifeDetails);
router.get('/lifeinsurencenews', lifeController.getNewsInsights);
router.post('/chat', authenticate, lifeController.queryLifeChat);
router.post('/recommendations', authenticate, lifeController.queryLifeRecommendations);

export default router;

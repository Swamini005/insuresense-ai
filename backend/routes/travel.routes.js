import express from 'express';
import * as travelController from '../controllers/travel.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/traveldetails', authenticate, travelController.postTravelDetails);
router.put('/traveldetails', authenticate, travelController.updateTravelDetails);
router.get('/travelinsurancenewsinsights', travelController.getNewsInsights);
router.post('/chat', authenticate, travelController.queryTravelChat);
router.post('/recommendations', authenticate, travelController.queryTravelRecommendations);

export default router;

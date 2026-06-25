import express from 'express';
import * as investmentController from '../controllers/investment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/investmentdetails', authenticate, investmentController.postInvestmentDetails);
router.put('/investmentdetails', authenticate, investmentController.updateInvestmentDetails);
router.get('/investmentnewsinsights', investmentController.getNewsInsights);
router.post('/chat', authenticate, investmentController.queryInvestmentChat);
router.post('/recommendations', authenticate, investmentController.queryInvestmentRecommendations);

export default router;

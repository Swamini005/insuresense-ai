
import express from 'express';
import * as investmentController from '../controllers/investment.controller.js';

const router = express.Router();

router.post('/investmentdetails', investmentController.postInvestmentDetails);
router.put('/investmentdetails', investmentController.updateInvestmentDetails);
router.get('/investmentnewsinsights', investmentController.getNewsInsights);
router.post('/investmentagent', investmentController.queryInvestmentAgent);

export default router;
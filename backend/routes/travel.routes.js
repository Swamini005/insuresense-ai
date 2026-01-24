
import express from 'express';
import * as travelController from '../controllers/travel.controller.js';

const router = express.Router();

router.post('/traveldetails', travelController.postTravelDetails);
router.put('/traveldetails', travelController.updateTravelDetails);
router.get('/travelinsurancenewsinsights', travelController.getNewsInsights);
router.post('/travelagent', travelController.queryTravelAgent);

export default router;

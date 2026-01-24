
import express from 'express';
import * as healthController from '../controllers/health.controller.js';

const router = express.Router();

router.post('/healthdetails', healthController.postHealthDetails);
router.put('/healthdetails', healthController.updateHealthDetails);
router.get('/healthinsurancenews', healthController.getNewsInsights);
router.post('/healthagent', healthController.queryHealthAgent);

export default router;

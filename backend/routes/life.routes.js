
import express from 'express';
import * as lifeController from '../controllers/life.controller.js';

const router = express.Router();

router.post('/lifedetails', lifeController.postLifeDetails);
router.put('/lifedetails', lifeController.updateLifeDetails);
router.get('/lifeinsurencenews', lifeController.getNewsInsights);
router.post('/lifeagent', lifeController.queryLifeAgent);

export default router;

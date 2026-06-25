import express from 'express';
import * as cryptoController from '../controllers/crypto.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/cryptodetails', authenticate, cryptoController.postCryptoDetails);
router.put('/cryptodetails', authenticate, cryptoController.updateCryptoDetails);
router.get('/cryptonewsinsights', cryptoController.getNewsInsights);
router.post('/chat', authenticate, cryptoController.queryCryptoChat);
router.post('/recommendations', authenticate, cryptoController.queryCryptoRecommendations);

export default router;

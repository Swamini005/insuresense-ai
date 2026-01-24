
import express from 'express';
import * as chatController from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/chatagent', chatController.getChatAgent);
router.post('/', chatController.chatWithAgent);

export default router;


import * as chatService from '../services/chat.service.js';

export const chatWithAgent = async (req, res) => {
    try {
        const { query } = req.body;
        const response = await chatService.processChatQuery(query);
        res.status(200).json({ response });
    } catch (error) {
        console.error("Error in chatWithAgent:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getChatAgent = async (req, res) => {
    try {
        const status = await chatService.getAgentStatus();
        res.status(200).json(status);
    } catch (error) {
        console.error("Error in getChatAgent:", error);
        res.status(500).json({ error: error.message });
    }
};

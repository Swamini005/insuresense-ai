import { processMastraRequest, saveAgentMemory } from '../services/mastra.service.js';

export const handleMastraChat = async (req, res) => {
    try {
        const { prompt, userId } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }

        const response = await processMastraRequest(prompt, userId);

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addMemory = async (req, res) => {
    try {
        const { key, value, context } = req.body;
        const savedMemory = await saveAgentMemory(key, value, context);
        res.status(201).json({ success: true, data: savedMemory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

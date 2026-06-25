import * as healthService from '../services/health.service.js';

export const postHealthDetails = async (req, res) => {
    try {
        const result = await healthService.submitHealthDetails(req.user.id, req.body);
        res.status(200).json({ message: "Health details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateHealthDetails = async (req, res) => {
    try {
        const result = await healthService.modifyHealthDetails(req.user.id, req.body);
        res.status(200).json({ message: "Health details updated", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNewsInsights = async (req, res) => {
    try {
        const insights = await healthService.fetchNewsInsights();
        res.status(200).json({ insights });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryHealthChat = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await healthService.askHealthChat(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryHealthRecommendations = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await healthService.askHealthRecommendations(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

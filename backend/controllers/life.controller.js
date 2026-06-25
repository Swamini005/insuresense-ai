import * as lifeService from '../services/life.service.js';

export const postLifeDetails = async (req, res) => {
    try {
        const result = await lifeService.submitLifeDetails(req.user.id, req.body);
        res.status(200).json({ message: "Life details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLifeDetails = async (req, res) => {
    try {
        const result = await lifeService.modifyLifeDetails(req.user.id, req.body);
        res.status(200).json({ message: "Life details updated", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNewsInsights = async (req, res) => {
    try {
        const insights = await lifeService.fetchNewsInsights();
        res.status(200).json({ insights });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryLifeChat = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await lifeService.askLifeChat(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryLifeRecommendations = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await lifeService.askLifeRecommendations(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

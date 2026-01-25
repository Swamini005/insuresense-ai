
import * as lifeService from '../services/life.service.js';

export const postLifeDetails = async (req, res) => {
    try {
        const details = req.body;
        const result = await lifeService.submitLifeDetails(details);
        res.status(200).json({ message: "Life details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLifeDetails = async (req, res) => {
    try {
        const details = req.body;
        const result = await lifeService.modifyLifeDetails(details);
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

export const queryLifeAgent = async (req, res) => {
    try {
        const { query } = req.body;
        const result = await lifeService.askLifeAgent(query, req.body.details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

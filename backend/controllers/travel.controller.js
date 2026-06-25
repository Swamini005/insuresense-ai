import * as travelService from '../services/travel.service.js';

export const postTravelDetails = async (req, res) => {
    try {
        const result = await travelService.submitTravelDetails(req.user.id, req.body);
        res.status(200).json({ message: "Travel details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTravelDetails = async (req, res) => {
    try {
        const result = await travelService.modifyTravelDetails(req.user.id, req.body);
        res.status(200).json({ message: "Travel details updated", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNewsInsights = async (req, res) => {
    try {
        const insights = await travelService.fetchNewsInsights();
        res.status(200).json({ insights });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryTravelChat = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await travelService.askTravelChat(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryTravelRecommendations = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await travelService.askTravelRecommendations(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

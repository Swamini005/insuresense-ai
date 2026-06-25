import * as investmentService from '../services/investment.service.js';

export const postInvestmentDetails = async (req, res) => {
    try {
        const result = await investmentService.submitInvestmentDetails(req.user.id, req.body);
        res.status(200).json({ message: "Investment details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateInvestmentDetails = async (req, res) => {
    try {
        const result = await investmentService.modifyInvestmentDetails(req.user.id, req.body);
        res.status(200).json({ message: "Investment details updated", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNewsInsights = async (req, res) => {
    try {
        const insights = await investmentService.fetchNewsInsights();
        res.status(200).json({ insights });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryInvestmentChat = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await investmentService.askInvestmentChat(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryInvestmentRecommendations = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await investmentService.askInvestmentRecommendations(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

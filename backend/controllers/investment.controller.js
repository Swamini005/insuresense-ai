
import * as investmentService from '../services/investment.service.js';

export const postInvestmentDetails = async (req, res) => {
    try {
        const details = req.body;
        const result = await investmentService.submitInvestmentDetails(details);
        res.status(200).json({ message: "Investment details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateInvestmentDetails = async (req, res) => {
    try {
        const details = req.body;
        const result = await investmentService.modifyInvestmentDetails(details);
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

export const queryInvestmentAgent = async (req, res) => {
    try {
        const { query } = req.body;
        const result = await investmentService.askInvestmentAgent(query);
        res.status(200).json(result); // result already has text and sources
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

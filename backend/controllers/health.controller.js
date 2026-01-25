
import * as healthService from '../services/health.service.js';

export const postHealthDetails = async (req, res) => {
    try {
        const details = req.body;
        const result = await healthService.submitHealthDetails(details);
        res.status(200).json({ message: "Health details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateHealthDetails = async (req, res) => {
    try {
        const details = req.body;
        const result = await healthService.modifyHealthDetails(details);
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

export const queryHealthAgent = async (req, res) => {
    try {
        const { query } = req.body;
        const result = await healthService.askHealthAgent(query, req.body.details);
        res.status(200).json({ response: result.response, report: result.report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

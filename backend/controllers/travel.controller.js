
import * as travelService from '../services/travel.service.js';

export const postTravelDetails = async (req, res) => {
    try {
        const details = req.body;
        const result = await travelService.submitTravelDetails(details);
        res.status(200).json({ message: "Travel details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTravelDetails = async (req, res) => {
    try {
        const details = req.body;
        const result = await travelService.modifyTravelDetails(details);
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

export const queryTravelAgent = async (req, res) => {
    try {
        const { query } = req.body;
        // Optionally pass details from session or db if needed, here we assume it might be passed or derived
        const result = await travelService.askTravelAgent(query, req.body.details);
        res.status(200).json({ response: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

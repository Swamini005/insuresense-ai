import * as cryptoService from '../services/crypto.service.js';

export const postCryptoDetails = async (req, res) => {
    try {
        const result = await cryptoService.submitCryptoDetails(req.user.id, req.body);
        res.status(200).json({ message: "Crypto details saved", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCryptoDetails = async (req, res) => {
    try {
        const result = await cryptoService.modifyCryptoDetails(req.user.id, req.body);
        res.status(200).json({ message: "Crypto details updated", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNewsInsights = async (req, res) => {
    try {
        const insights = await cryptoService.fetchNewsInsights();
        res.status(200).json({ insights });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryCryptoChat = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await cryptoService.askCryptoChat(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const queryCryptoRecommendations = async (req, res) => {
    try {
        const { query, details } = req.body;
        const result = await cryptoService.askCryptoRecommendations(req.user.id, query, details);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

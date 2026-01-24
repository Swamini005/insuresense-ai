
import { runInvestmentAgent } from '../agent/investment.agent.js';
import { getGeminiModel } from './gemini.js';

// Mock store
let investmentDetailsStore = {};

export const saveInvestmentDetails = async (details) => {
    console.log("Saving investment details:", details);
    investmentDetailsStore = { ...investmentDetailsStore, ...details };
    return investmentDetailsStore;
};

export const updateInvestmentDetails = async (details) => {
    console.log("Updating investment details:", details);
    investmentDetailsStore = { ...investmentDetailsStore, ...details };
    return investmentDetailsStore;
};

export const getInvestmentNewsInsights = async () => {
    try {
        const model = getGeminiModel();
        const prompt = "Provide the latest investment market news and insights. Format as JSON with title, summary, and source.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching investment news:", error);
        throw error;
    }
};

export const queryInvestmentAgent = async (query) => {
    return await runInvestmentAgent(query, investmentDetailsStore);
};

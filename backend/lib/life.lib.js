
import { getGeminiModel } from './gemini.js';

// Mock store
let lifeDetailsStore = {};

export const saveLifeDetails = async (details) => {
    console.log("Saving life details:", details);
    lifeDetailsStore = { ...lifeDetailsStore, ...details };
    return lifeDetailsStore;
};

export const updateLifeDetails = async (details) => {
    console.log("Updating life details:", details);
    lifeDetailsStore = { ...lifeDetailsStore, ...details };
    return lifeDetailsStore;
};

export const getLifeNewsInsights = async () => {
    try {
        const model = getGeminiModel();
        const prompt = "Provide the latest life insurance news and insights. Format as JSON with title, summary, and source.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching life news:", error);
        throw error;
    }
};

export const queryLifeAgent = async (query, context) => {
    try {
        const model = getGeminiModel();
        const prompt = `You are a helpful Life Insurance Agent. 
        Context: ${JSON.stringify(context || lifeDetailsStore)}
        User Query: ${query}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error querying life agent:", error);
        throw error;
    }
};

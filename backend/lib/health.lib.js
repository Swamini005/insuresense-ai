
import { getGeminiModel } from './gemini.js';

// Mock store
let healthDetailsStore = {};

export const saveHealthDetails = async (details) => {
    console.log("Saving health details:", details);
    healthDetailsStore = { ...healthDetailsStore, ...details };
    return healthDetailsStore;
};

export const updateHealthDetails = async (details) => {
    console.log("Updating health details:", details);
    healthDetailsStore = { ...healthDetailsStore, ...details };
    return healthDetailsStore;
};

export const getHealthNewsInsights = async () => {
    try {
        const model = getGeminiModel();
        const prompt = "Provide the latest health insurance news and insights. Format as JSON with title, summary, and source.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching health news:", error);
        throw error;
    }
};

export const queryHealthAgent = async (query, context) => {
    try {
        const model = getGeminiModel();
        const prompt = `You are a helpful Health Insurance Agent. 
        Context: ${JSON.stringify(context || healthDetailsStore)}
        User Query: ${query}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error querying health agent:", error);
        throw error;
    }
};

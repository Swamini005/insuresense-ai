
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
        User Query: ${query}
        
        Instructions:
        1. Answer based on user context (age, income, family, etc.).
        2. USE GOOGLE SEARCH to find REAL & CURRENT life insurance (Term/Whole Life) plans.
        3. Recommend a specific real policy.
        4. Return ONLY a valid JSON object:
        {
            "text": "Your answer...",
            "products": [
                { "id": "l1", "name": "Secure Life Plus", "description": "High cover term plan...", "price": "₹12,000/yr" }
            ]
        }`;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        try {
            const jsonStr = textResponse.replace(/^```json\n|\n```$/g, "").trim();
            const parsed = JSON.parse(jsonStr);
            return parsed;
        } catch (e) {
            console.error("Failed to parse JSON from life agent");
            return { text: textResponse, products: [] };
        }
    } catch (error) {
        console.error("Error querying life agent:", error);
        throw error;
    }
};

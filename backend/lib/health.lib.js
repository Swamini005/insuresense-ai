
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
        User Query: ${query}
        
        Instructions:
        1. Answer the user's question based on their context (age, location, pre-existing conditions, etc.).
        2. USE GOOGLE SEARCH to find REAL & CURRENT health insurance plans in India.
        3. Recommend 1-3 specific real products.
        4. Return ONLY a valid JSON object:
        {
            "text": "Your answer...",
            "products": [
                { "id": "h1", "name": "Health Guard Gold", "description": "Comprehensive coverage...", "price": "₹15,000/yr" }
            ]
        }`;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        try {
            const jsonStr = textResponse.replace(/^```json\n|\n```$/g, "").trim();
            const parsed = JSON.parse(jsonStr);
            return parsed;
        } catch (e) {
            console.error("Failed to parse JSON from health agent");
            return { text: textResponse, products: [] };
        }
    } catch (error) {
        console.error("Error querying health agent:", error);
        throw error;
    }
};

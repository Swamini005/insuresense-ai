
import { getGeminiModel } from './gemini.js';

// TODO: Integrate with Database for persistence
let travelDetailsStore = {}; // In-memory mock for now

export const saveTravelDetails = async (details) => {
    // Mock saving to DB
    console.log("Saving travel details:", details);
    travelDetailsStore = { ...travelDetailsStore, ...details };
    return travelDetailsStore;
};

export const updateTravelDetails = async (details) => {
    // Mock updating DB
    console.log("Updating travel details:", details);
    travelDetailsStore = { ...travelDetailsStore, ...details };
    return travelDetailsStore;
};

export const getTravelNewsInsights = async () => {
    try {
        const model = getGeminiModel();
        const prompt = "Provide the latest travel insurance news and insights. Format as JSON with title, summary, and source.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching travel news:", error);
        throw error;
    }
};

export const queryTravelAgent = async (query, context) => {
    try {
        const model = getGeminiModel();
        const prompt = `You are a helpful Travel Insurance Agent. 
        Context: ${JSON.stringify(context || travelDetailsStore)}
        User Query: ${query}
        
        Instructions:
        1. Answer based on travel details (destination, dates, travelers).
        2. USE GOOGLE SEARCH to find REAL & CURRENT travel insurance plans.
        3. Recommend a relevant real plan.
        4. Return ONLY a valid JSON object:
        {
            "text": "Your answer...",
            "products": [
                { "id": "t1", "name": "Global Trekker", "description": "Medical & baggage cover...", "price": "₹2,500" }
            ]
        }`;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        try {
            const jsonStr = textResponse.replace(/^```json\n|\n```$/g, "").trim();
            const parsed = JSON.parse(jsonStr);
            return parsed;
        } catch (e) {
            console.error("Failed to parse JSON from travel agent");
            return { text: textResponse, products: [] };
        }
    } catch (error) {
        console.error("Error querying travel agent:", error);
        throw error;
    }
};

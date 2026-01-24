
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
        User Query: ${query}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error querying travel agent:", error);
        throw error;
    }
};

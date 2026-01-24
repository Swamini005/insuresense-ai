
import { getGeminiModel } from './gemini.js';

export const chatWithGemini = async (message) => {
    try {
        const model = getGeminiModel();
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error interacting with Gemini:", error);
        throw error;
    }
};

export const getChatAgentStatus = async () => {
    return { status: "active", message: "Chat Agent is ready to help." };
};

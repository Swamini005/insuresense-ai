
import { getGeminiModel } from './gemini.js';

import { ChatAgent } from '../agent/chat.agent.js';

export const chatWithGemini = async (message) => {
    try {
        const model = getGeminiModel();

        const systemPrompt = "You are a helpful insurance assistant. Answer the user's question concisely.";
        const finalPrompt = `${systemPrompt}\nUser: ${message}`;

        const result = await model.generateContent(finalPrompt);
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

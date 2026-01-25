import { getGeminiModel } from "../lib/gemini.js";

export const ChatAgent = {
    name: "chat-agent",
    description: "General insurance assistant using Google Search",

    run: async ({ input }) => {
        if (!input) throw new Error("Prompt is required");

        const finalPrompt = `
You are a helpful insurance assistant.
User Question: ${input}

Instructions:
1. Answer the user's question about insurance.
2. USE GOOGLE SEARCH if you need current information (e.g., "what are top plans").
3. Return a helpful text response.
    `.trim();

        const result = await getGeminiModel().generateContent(finalPrompt);
        return { text: result.response.text() };
    }
};

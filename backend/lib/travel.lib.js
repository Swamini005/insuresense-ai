import { getGroqModel } from './groq.js';

export const getTravelNewsInsights = async () => {
    try {
        const model = getGroqModel();
        const prompt = "Provide the latest travel insurance news and insights. Format as simple, clean markdown with bullet points. DO NOT output JSON. DO NOT use arrays. Use standard Markdown headings and lists.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching travel news:", error);
        throw error;
    }
};

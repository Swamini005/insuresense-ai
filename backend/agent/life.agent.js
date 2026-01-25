import { getGeminiModel } from "../lib/gemini.js";

export const LifeAgent = {
    name: "life-agent",
    description: "Life insurance expert agent",

    run: async ({ input, context }) => {
        if (!input) throw new Error("Prompt is required");

        const userProfileText = context ? JSON.stringify(context, null, 2) : "No user profile available.";

        const finalPrompt = `
You are an expert life insurance agent.
Your goal is to recommend specific life/term insurance plans.

User Profile:
${userProfileText}

User Request:
${input}

Instructions:
1. Analyze the user's profile (age, income, dependents).
2. USE GOOGLE SEARCH to find REAL, LIVE term/life insurance plans in India (e.g., LIC, HDFC Life, Max Life).
3. Return ONLY a valid JSON object:
{
  "text": "Your personalized advice...",
  "products": [
    {
      "id": "unique_id",
      "name": "Exact Plan Name",
      "description": "Why it fits",
      "price": "Approx Premium (₹)"
    }
  ]
}
    `.trim();

        const result = await getGeminiModel().generateContent(finalPrompt);
        const textResponse = result.response.text();

        try {
            const jsonStr = textResponse.replace(/^```json\n|\n```$/g, "").trim();
            const parsed = JSON.parse(jsonStr);
            return {
                text: parsed.text,
                products: parsed.products || [],
                sources: []
            };
        } catch (e) {
            console.error("Failed to parse JSON from life agent:", textResponse);
            return {
                text: textResponse,
                products: [],
                sources: []
            };
        }
    }
};

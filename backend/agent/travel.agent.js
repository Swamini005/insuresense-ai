import { getGeminiModel } from "../lib/gemini.js";
import { loadTravelMemoryForLLM } from "../memory/travel.memory.js";

export const TravelAgent = {
  name: "travel-agent",
  description: "Travel insurance expert agent",

  run: async ({ input, context }) => {
    if (!input) throw new Error("Prompt is required");

    const userProfileText = context ? JSON.stringify(context, null, 2) : "No user profile available.";

    const finalPrompt = `
You are an expert travel insurance agent.
Your goal is to recommend specific travel insurance plans.

User Profile:
${userProfileText}

User Request:
${input}

Instructions:
1. Analyze the user's trip details (destination, duration, travelers).
2. USE GOOGLE SEARCH to find REAL, LIVE travel insurance plans in India (e.g., Tata AIG, Reliance, ICICI Lombard).
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
      console.error("Failed to parse JSON from travel agent:", textResponse);
      return {
        text: textResponse,
        products: [],
        sources: []
      };
    }
  }
};
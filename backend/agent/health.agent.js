import { getGeminiModel } from "../lib/gemini.js";
import { loadHealthMemoryForLLM } from "../memory/health.memory.js";

export const HealthAgent = {
  name: "health-agent",
  description: "Health insurance expert agent",

  run: async ({ input, context }) => {
    if (!input) throw new Error("Prompt is required");

    // Load memories or just use context
    // Ideally we fetch recent news from HealthMemory if available
    const contextText = "Recent health insurance market updates and user context.";

    const userProfileText = context ? JSON.stringify(context, null, 2) : "No user profile available.";

    const finalPrompt = `
You are an expert health insurance agent.
Your goal is to recommend specific health insurance plans based on the user's profile.

User Profile:
${userProfileText}

User Request:
${input}

Instructions:
1. Analyze the user's profile (age, location, coverage needs, etc.).
2. USE GOOGLE SEARCH to find REAL, LIVE health insurance plans in India (e.g., Star Health, HDFC Ergo, Niva Bupa) that fit their profile.
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
      console.error("Failed to parse JSON from health agent:", textResponse);
      return {
        text: textResponse,
        products: [],
        sources: []
      };
    }
  }
};
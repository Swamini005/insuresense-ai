import { getGroqModel } from "../lib/groq.js";
import { loadHealthMemoryForLLM } from "../memory/health.memory.js";

export const HealthAgent = {
  name: "health-agent",
  description: "Health insurance expert agent",

  chat: async ({ input, context }) => {
    if (!input) throw new Error("Prompt is required");
    const userProfileText = context ? JSON.stringify(context, null, 2) : "No user profile available.";

    const finalPrompt = `
You are an expert, helpful health insurance agent.
Your goal is to answer the user's query conversationally and providing guidance.

User Profile Context:
${userProfileText}

User Query:
${input}

Instructions:
1. Provide a direct, friendly, and helpful text response to their query.
2. DO NOT output JSON. Use standard markdown paragraphs and lists.
    `.trim();

    const result = await getGroqModel({ responseFormat: 'text' }).generateContent(finalPrompt);
    return { text: result.response.text(), products: [], sources: [] };
  },

  recommend: async ({ input, context }) => {
    if (!input) throw new Error("Prompt is required");
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
3. Return ONLY a valid JSON object matching exactly this structure:
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

    const result = await getGroqModel({ responseFormat: 'json_object' }).generateContent(finalPrompt);
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
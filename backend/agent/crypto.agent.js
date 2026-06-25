import { getGroqModel } from "../lib/groq.js";
import { getRecentCryptoNews } from "../memory/crypto.memory.js";

export const CryptoAgent = {
  name: "crypto-agent",
  description: "Expert crypto analyst agent using recent crypto news and live web search",

  chat: async ({ input, context }) => {
    if (!input) throw new Error("Prompt is required");
    const userProfileText = context ? JSON.stringify(context, null, 2) : "No user profile available.";

    const finalPrompt = `
You are an expert, helpful crypto and web3 agent.
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
You are an expert crypto and web3 agent.
Your goal is to recommend specific crypto products/assets based on the user's profile.

User Profile:
${userProfileText}

User Request:
${input}

Instructions:
1. Analyze the user's profile.
2. Recommend real, current crypto assets, staking pools, or platforms.
3. Return ONLY a valid JSON object matching exactly this structure:
{
  "text": "Your personalized advice...",
  "products": [
    {
      "id": "unique_id",
      "name": "Exact Asset Name",
      "description": "Why it fits",
      "price": "Approx Value/Yield"
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
      console.error("Failed to parse JSON from crypto agent:", textResponse);
      return {
        text: textResponse,
        products: [],
        sources: []
      };
    }
  }
};

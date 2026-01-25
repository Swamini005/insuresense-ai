import { getGeminiModel } from "../lib/gemini.js";
import { InvestmentMemory } from "../memory/investment.memory.js";

export const InvestmentAgent = {
  name: "investment-agent",
  description: "Expert investment analyst agent using recent investment news",

  run: async ({ input, context }) => {
    if (!input) throw new Error("Prompt is required");

    const allMemories = await InvestmentMemory.find({}).sort({ publishedAt: -1 }).limit(10).lean();

    const contextText = allMemories.length === 0
      ? "No investment news in memory."
      : allMemories
        .map(m => `
Title: ${m.title ?? "—"}
Source: ${m.publisher ?? "—"}
URL: ${m.publisherUrl ?? "—"}
Content: ${m.contentSnippet || m.content || "—"}
          `.trim())
        .join("\n---\n");

    const userProfileText = context ? JSON.stringify(context, null, 2) : "No user profile available.";

    const finalPrompt = `
You are an expert investment analyst agent.
Your goal is to provide personalized investment advice and recommend specific investment products based on the user's profile and recent news.

Recent Investment News:
${contextText}

User Profile:
${userProfileText}

User User Question:
${input}

Instructions:
1. Analyze the user's profile (risk appetite, goals, income, etc.) and the news.
2. Answer the user's question.
3. USE GOOGLE SEARCH to find REAL, LIVE, and CURRENT investment products available in India that fit their profile. Do NOT makeup fake products.
4. Return ONLY a valid JSON object with the following structure:
{
  "text": "Your personalized advice here...",
  "products": [
    {
      "id": "unique_id",
      "name": "Exact Product Name found via Search",
      "description": "Short description and why it fits",
      "price": "Current NAV / Min SIP / Returns"
    }
  ]
}
    `.trim();

    const result = await getGeminiModel().generateContent(finalPrompt);
    const textResponse = result.response.text();

    try {
      // Clean markdown blocks if present
      const jsonStr = textResponse.replace(/^```json\n|\n```$/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      return {
        text: parsed.text,
        products: parsed.products || [],
        sources: allMemories.slice(0, 5).map(c => ({
          title: c.title,
          url: c.publisherUrl
        }))
      };
    } catch (e) {
      console.error("Failed to parse JSON from agent:", textResponse);
      return {
        text: textResponse, // Fallback to raw text
        sources: allMemories.slice(0, 5).map(c => ({
          title: c.title,
          url: c.publisherUrl
        }))
      };
    }
  }
};
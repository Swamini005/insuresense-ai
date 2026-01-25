import { getGeminiModel } from "../lib/gemini.js";
import { InvestmentMemory } from "../memory/investment.memory.js";

export const InvestmentAgent = {
  name: "investment-agent",
  description: "Expert investment analyst agent using recent investment news",

  run: async ({ input }) => {
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

    const finalPrompt = `
Recent Investment News:
${contextText}

User Question:
${input}
    `.trim();

    const result = await getGeminiModel().generateContent(finalPrompt);
    const text = result.response.text();

    return {
      text,
      sources: allMemories.slice(0, 5).map(c => ({
        title: c.title,
        url: c.publisherUrl
      }))
    };
  }
};
import { getGeminiModel } from "../lib/gemini.js";
import { loadHealthMemoryForLLM } from "../memory/health.memory.js";

export const HealthAgent = {
  name: "health-agent",
  description: "Health insurance expert using product data from memory",

  run: async ({ input }) => {
    if (!input) throw new Error("Prompt is required");

    const contextText = await loadHealthMemoryForLLM({ connect: true });

    const finalPrompt = `
Health insurance product data:
${contextText}

User question:
${input}
    `.trim();

    const result = await getGeminiModel().generateContent(finalPrompt);
    return { text: result.response.text() };
  }
};
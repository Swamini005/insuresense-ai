import { getGeminiModel } from "../lib/gemini.js";
import { loadTravelMemoryForLLM } from "../memory/travel.memory.js";

export const TravelAgent = {
  name: "travel-agent",
  description: "Travel insurance expert using product data from memory",

  run: async ({ input }) => {
    if (!input) throw new Error("Prompt is required");

    const contextText = await loadTravelMemoryForLLM({ connect: true });

    const finalPrompt = `
Travel insurance product data:
${contextText}

User question:
${input}
    `.trim();

    const result = await getGeminiModel().generateContent(finalPrompt);
    return { text: result.response.text() };
  }
};
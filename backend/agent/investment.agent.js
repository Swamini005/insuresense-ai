
import { getGeminiModel } from "../lib/gemini.js";
import { InvestmentMemory } from "../memory/investment.memory.js";
import { generateEmbedding } from "../utils/vector.utils.js";

function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const runInvestmentAgent = async (input, userProfile = {}) => {
  if (!input) {
    throw new Error("Prompt is required");
  }

  try {
    const userEmbedding = await generateEmbedding(input);
    const allMemories = await InvestmentMemory.find({});

    const scoredMemories = allMemories.map(mem => {
      const similarity = cosineSimilarity(userEmbedding, mem.values);
      return {
        ...mem.toObject(),
        similarity
      };
    });

    scoredMemories.sort((a, b) => b.similarity - a.similarity);

    const topContext = scoredMemories.slice(0, 3);

    const contextText = topContext
      .map(m => `
    Title: ${m.metadata.title}
    Source: ${m.metadata.source}
    Content: ${m.fullText}
            `.trim())
      .join("\n---\n");

    const finalPrompt = `
    You are an expert Investment Analyst.
    Answer user questions using the most relevant recent investment news.
    Also consider the user's profile if provided.
    
    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Recent Investment News:
    ${contextText}

    User Question:
    ${input}
        `.trim();

    const model = getGeminiModel();
    const result = await model.generateContent(finalPrompt);
    const text = result.response.text();

    return {
      text,
      sources: topContext.map(c => ({
        title: c.metadata.title,
        url: c.metadata.url
      }))
    };
  } catch (error) {
    console.error("Error in InvestmentAgent:", error);
    throw error;
  }
};
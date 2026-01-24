import { getGeminiModel } from '../lib/gemini.js';
import { AgentMemory } from '../memory/mastra.memory.js';

export const processMastraRequest = async (prompt, userId) => {
    try {
        const model = getGeminiModel();

        // Retrieve relevant memory (simple example)
        // In a real agent, this would be RAG or more complex context injection
        const memories = await AgentMemory.find({ agentName: 'mastra' }).limit(5);
        const memoryContext = memories.map(m => `${m.key}: ${m.value}`).join('\n');

        const fullPrompt = `
        Context:
        ${memoryContext}

        User Request: ${prompt}
        `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Error in Mastra Service:', error);
        throw new Error('Failed to process Mastra request');
    }
};

export const saveAgentMemory = async (key, value, context) => {
    const memory = new AgentMemory({
        agentName: 'mastra',
        key,
        value,
        context
    });
    return await memory.save();
};

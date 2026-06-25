import { getGroqModel } from '../lib/groq.js';
import { getAgentMemories, saveAgentMemory as persistAgentMemory } from '../memory/mastra.memory.js';

export const processMastraRequest = async (prompt, userId) => {
    try {
        const model = getGroqModel({ search: false });

        // Retrieve relevant memory (simple example)
        // In a real agent, this would be RAG or more complex context injection
        const memories = await getAgentMemories('mastra', 5);
        const memoryContext = memories
            .map(m => `${m.key}: ${typeof m.value === 'string' ? m.value : JSON.stringify(m.value)}`)
            .join('\n');

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
    return await persistAgentMemory({ agentName: 'mastra', key, value, context });
};

import { getGeminiModel } from '../lib/gemini.js';

/**
 * Generates an embedding for the given text using the Gemini model.
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} - The embedding vector.
 */
export const generateEmbedding = async (text) => {
    try {
        const model = getGeminiModel('text-embedding-004'); // Using a specific embedding model if available, or 'embedding-001'
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
};

/**
 * Cleans the text by removing special characters and extra spaces.
 * @param {string} text - The text to clean.
 * @returns {string} - The cleaned text.
 */
export const cleanText = (text) => {
    return text
        .replace(/[^\w\s.,?!]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')        // Normalize whitespace
        .trim();
};

/**
 * Stores vectors locally - Placeholder compatibility function requested by user code,
 * but real implementation uses MongoDB in investment.webhook.js
 */
export const storeVectorsLocally = async (vectors) => {
    // In our architecture, the webhook handles storage directly to MongoDB.
    // This function is kept for signature compatibility if needed, or can be a no-op.
    console.log(`[Vector Utils] Helper: passing ${vectors.length} vectors to storage logic.`);
    return true;
};

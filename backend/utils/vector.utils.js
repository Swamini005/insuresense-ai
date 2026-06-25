/**
 * Generates an embedding for the given text.
 *
 * NOTE: Groq does not serve embedding models, so this is currently unsupported.
 * Nothing in the live request path calls it today (the investment agent reads
 * recent news from Postgres by recency, not vector similarity). If/when vector
 * search is needed, wire a dedicated embeddings provider (e.g. a local model,
 * Voyage, or OpenAI) here.
 *
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} - The embedding vector.
 */
export const generateEmbedding = async (_text) => {
    throw new Error(
        'generateEmbedding is not supported: Groq has no embedding models. ' +
        'Wire a dedicated embeddings provider before using vector search.'
    );
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
 * Stores vectors locally - Placeholder compatibility function.
 * Real storage is handled directly in Postgres by investment.webhook.js.
 */
export const storeVectorsLocally = async (vectors) => {
    // In our architecture, the webhook upserts directly to Postgres (Knex).
    // This function is kept for signature compatibility if needed, or can be a no-op.
    console.log(`[Vector Utils] Helper: passing ${vectors.length} vectors to storage logic.`);
    return true;
};

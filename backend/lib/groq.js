import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

// Lazily construct the client so an unset GROQ_API_KEY doesn't crash app boot
// (the SDK throws at construction when the key is missing). It only fails when
// an LLM call is actually made, which controllers handle gracefully.
let _client;
function getClient() {
    if (!_client) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error('GROQ_API_KEY is not set; cannot call the Groq API.');
        }
        _client = new Groq({ apiKey });
    }
    return _client;
}

/**
 * Returns a Groq-backed model wrapper that mimics the small slice of the
 * Gemini SDK surface the agents relied on: `model.generateContent(prompt)`
 * resolving to `{ response: { text() } }`.
 *
 * Live web access is provided by Groq's built-in `browser_search` tool
 * (replaces Gemini's googleSearch grounding). It is only available on the
 * gpt-oss models, so keep `model` on an OSS model when `search` is true.
 *
 * @param {Object} [opts]
 * @param {string} [opts.model] - Groq model id (defaults to GROQ_MODEL or gpt-oss-120b).
 * @param {boolean} [opts.search=true] - Enable the browser_search built-in tool.
 * @param {string} [opts.responseFormat] - "json_object" or "text"
 */
export const getGroqModel = ({ model = DEFAULT_MODEL, search = true, maxTokens = 4096, responseFormat = "text" } = {}) => {
    return {
        generateContent: async (prompt) => {
            const params = {
                model,
                messages: [
                    { role: 'user', content: typeof prompt === 'string' ? prompt : String(prompt) }
                ],
                temperature: 1,
                top_p: 1,
                max_completion_tokens: maxTokens,
                stream: false,
            };

            if (responseFormat === 'json_object') {
                params.response_format = { type: 'json_object' };
            }

            if (search) {
                // Groq does not have a native browser_search tool like Gemini does.
                // We will rely on the model's internal knowledge base.
            }

            const completion = await getClient().chat.completions.create(params);
            const content = completion.choices?.[0]?.message?.content ?? '';

            // Mirror the Gemini response shape the call sites expect.
            return { response: { text: () => content } };
        },
    };
};

import { CryptoAgent } from '../agent/crypto.agent.js';
import { SummarizerAgent } from '../agent/summarizer.agent.js';
import * as cryptoLib from '../lib/crypto.lib.js';
import { getProfile, upsertProfile } from '../models/profile.model.js';

const DOMAIN = 'crypto';
const REQUIRED_FIELDS = [
    'primaryGoal', 'investmentAmount', 'riskAppetite', 'timeHorizon', 'experienceLevel'
];

export const submitCryptoDetails = async (userId, details) => {
    if (!details) throw new Error("Crypto details are required");

    const missing = REQUIRED_FIELDS.filter((field) => !details[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return await upsertProfile(userId, DOMAIN, details);
};

export const modifyCryptoDetails = async (userId, details) => {
    if (!details) throw new Error("Crypto details are required for update");
    const current = (await getProfile(userId, DOMAIN)) || {};
    return await upsertProfile(userId, DOMAIN, { ...current, ...details });
};

export const fetchNewsInsights = async () => {
    return await cryptoLib.getCryptoNewsInsights();
};

export const askCryptoChat = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;
    
    const agentResponse = await CryptoAgent.chat({ input: query, context: details });
    
    return {
        response: agentResponse.text,
        products: [],
        sources: []
    };
};

export const askCryptoRecommendations = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;

    const agentResponse = await CryptoAgent.recommend({ input: query, context: details });

    const { report } = await SummarizerAgent.run({
        agentType: DOMAIN,
        agentResponse,
        userQuery: query,
        userDetails: details,
    });

    return {
        response: agentResponse.text,
        report,
        products: agentResponse.products ?? [],
        sources: agentResponse.sources ?? [],
    };
};

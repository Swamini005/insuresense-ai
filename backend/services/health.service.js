import { HealthAgent } from '../agent/health.agent.js';
import { SummarizerAgent } from '../agent/summarizer.agent.js';
import * as healthLib from '../lib/health.lib.js';
import { getProfile, upsertProfile } from '../models/profile.model.js';

const DOMAIN = 'health';
const REQUIRED_FIELDS = [
    'healthIntent', 'coverageType', 'city', 'state',
    'hasPreExisting', 'sumInsured', 'hospitalPref', 'timeline'
];

const isBlank = (v) => v === undefined || v === null || v === '';

export const submitHealthDetails = async (userId, details) => {
    if (!details) throw new Error("Health details are required");

    const missing = REQUIRED_FIELDS.filter((field) => isBlank(details[field]));
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (!Array.isArray(details.familyMembers)) {
        details.familyMembers = [];
    }

    return await upsertProfile(userId, DOMAIN, details);
};

export const modifyHealthDetails = async (userId, details) => {
    if (!details) throw new Error("Health details are required for update");
    const current = (await getProfile(userId, DOMAIN)) || {};
    return await upsertProfile(userId, DOMAIN, { ...current, ...details });
};

export const fetchNewsInsights = async () => {
    return await healthLib.getHealthNewsInsights();
};

export const askHealthChat = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;
    
    // For pure chat, we bypass the summarizer and don't expect products
    const agentResponse = await HealthAgent.chat({ input: query, context: details });
    
    return {
        response: agentResponse.text,
        products: [],
        sources: []
    };
};

export const askHealthRecommendations = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;

    const agentResponse = await HealthAgent.recommend({ input: query, context: details });

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

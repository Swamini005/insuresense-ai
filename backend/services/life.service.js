import { LifeAgent } from '../agent/life.agent.js';
import { SummarizerAgent } from '../agent/summarizer.agent.js';
import * as lifeLib from '../lib/life.lib.js';
import { getProfile, upsertProfile } from '../models/profile.model.js';

const DOMAIN = 'life';
const REQUIRED_FIELDS = [
    'currentAge', 'primaryGoal', 'annualIncome', 'minMonthlyExpense',
    'marketRisk', 'occupationRisk', 'payoutPref'
];

const isBlank = (v) => v === undefined || v === null || v === '';

export const submitLifeDetails = async (userId, details) => {
    if (!details) throw new Error("Life details are required");

    const missing = REQUIRED_FIELDS.filter((field) => isBlank(details[field]));
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return await upsertProfile(userId, DOMAIN, details);
};

export const modifyLifeDetails = async (userId, details) => {
    if (!details) throw new Error("Life details are required for update");
    const current = (await getProfile(userId, DOMAIN)) || {};
    return await upsertProfile(userId, DOMAIN, { ...current, ...details });
};

export const fetchNewsInsights = async () => {
    return await lifeLib.getLifeNewsInsights();
};

export const askLifeChat = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;
    
    const agentResponse = await LifeAgent.chat({ input: query, context: details });
    
    return {
        response: agentResponse.text,
        products: [],
        sources: []
    };
};

export const askLifeRecommendations = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;

    const agentResponse = await LifeAgent.recommend({ input: query, context: details });

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

import { InvestmentAgent } from '../agent/investment.agent.js';
import { SummarizerAgent } from '../agent/summarizer.agent.js';
import * as investmentLib from '../lib/investment.lib.js';
import { getProfile, upsertProfile } from '../models/profile.model.js';

const DOMAIN = 'investment';
const REQUIRED_FIELDS = [
    'primaryGoal', 'timeHorizon', 'investmentType',
    'plannedAmount', 'currentAge', 'annualIncome',
    'monthlyExpenses', 'riskAppetite'
];

const isBlank = (v) => v === undefined || v === null || v === '';

export const submitInvestmentDetails = async (userId, details) => {
    if (!details) throw new Error("Investment details are required");

    const missing = REQUIRED_FIELDS.filter((field) => isBlank(details[field]));
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return await upsertProfile(userId, DOMAIN, details);
};

export const modifyInvestmentDetails = async (userId, details) => {
    if (!details) throw new Error("Investment details are required for update");
    const current = (await getProfile(userId, DOMAIN)) || {};
    return await upsertProfile(userId, DOMAIN, { ...current, ...details });
};

export const fetchNewsInsights = async () => {
    return await investmentLib.getInvestmentNewsInsights();
};

export const askInvestmentChat = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;
    
    const agentResponse = await InvestmentAgent.chat({ input: query, context: details });
    
    return {
        response: agentResponse.text,
        products: [],
        sources: []
    };
};

export const askInvestmentRecommendations = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;

    const agentResponse = await InvestmentAgent.recommend({ input: query, context: details });

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

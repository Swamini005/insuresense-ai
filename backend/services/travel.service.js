import { TravelAgent } from '../agent/travel.agent.js';
import { SummarizerAgent } from '../agent/summarizer.agent.js';
import * as travelLib from '../lib/travel.lib.js';
import { getProfile, upsertProfile } from '../models/profile.model.js';

const DOMAIN = 'travel';
const REQUIRED_FIELDS = [
    'intent', 'origin', 'destination', 'startDate', 'endDate',
    'travelers', 'purpose', 'bookingStatus', 'tripCost', 'riskAppetite'
];

const isBlank = (v) => v === undefined || v === null || v === '';

export const submitTravelDetails = async (userId, details) => {
    if (!details) throw new Error("Travel details are required");

    const missing = REQUIRED_FIELDS.filter((field) => isBlank(details[field]));
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return await upsertProfile(userId, DOMAIN, details);
};

export const modifyTravelDetails = async (userId, details) => {
    if (!details) throw new Error("Travel details are required for update");
    const current = (await getProfile(userId, DOMAIN)) || {};
    return await upsertProfile(userId, DOMAIN, { ...current, ...details });
};

export const fetchNewsInsights = async () => {
    return await travelLib.getTravelNewsInsights();
};

export const askTravelChat = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;
    
    const agentResponse = await TravelAgent.chat({ input: query, context: details });
    
    return {
        response: agentResponse.text,
        products: [],
        sources: []
    };
};

export const askTravelRecommendations = async (userId, query, inlineDetails) => {
    if (!query) throw new Error("Query is required");
    const details = inlineDetails ?? (await getProfile(userId, DOMAIN)) ?? undefined;

    const agentResponse = await TravelAgent.recommend({ input: query, context: details });

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

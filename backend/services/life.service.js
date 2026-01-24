
import * as lifeLib from '../lib/life.lib.js';

export const submitLifeDetails = async (details) => {
    if (!details) throw new Error("Life details are required");

    // Validation based on frontend fields
    const requiredFields = [
        'currentAge', 'primaryGoal', 'annualIncome',
        'minMonthlyExpense', 'marketRisk', 'occupationRisk',
        'payoutPref'
    ];

    const missing = requiredFields.filter(field => !details[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return await lifeLib.saveLifeDetails(details);
};

export const modifyLifeDetails = async (details) => {
    if (!details) throw new Error("Life details are required for update");
    return await lifeLib.updateLifeDetails(details);
};

export const fetchNewsInsights = async () => {
    return await lifeLib.getLifeNewsInsights();
};

export const askLifeAgent = async (query, details) => {
    if (!query) throw new Error("Query is required");
    return await lifeLib.queryLifeAgent(query, details);
};

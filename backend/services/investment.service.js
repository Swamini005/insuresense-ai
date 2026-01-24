
import * as investmentLib from '../lib/investment.lib.js';

export const submitInvestmentDetails = async (details) => {
    if (!details) throw new Error("Investment details are required");

    // Validation based on frontend fields
    const requiredFields = [
        'primaryGoal', 'timeHorizon', 'investmentType',
        'plannedAmount', 'currentAge', 'annualIncome',
        'monthlyExpenses', 'riskAppetite'
    ];

    const missing = requiredFields.filter(field => !details[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return await investmentLib.saveInvestmentDetails(details);
};

export const modifyInvestmentDetails = async (details) => {
    if (!details) throw new Error("Investment details are required for update");
    return await investmentLib.updateInvestmentDetails(details);
};

export const fetchNewsInsights = async () => {
    return await investmentLib.getInvestmentNewsInsights();
};

export const askInvestmentAgent = async (query) => {
    if (!query) throw new Error("Query is required");
    return await investmentLib.queryInvestmentAgent(query);
};


import * as healthLib from '../lib/health.lib.js';

export const submitHealthDetails = async (details) => {
    if (!details) throw new Error("Health details are required");

    // Validation based on frontend fields
    const requiredFields = [
        'healthIntent', 'coverageType',
        'city', 'state', 'hasPreExisting',
        'sumInsured', 'hospitalPref', 'timeline'
    ];

    const missing = requiredFields.filter(field => !details[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate structured fields
    if (!Array.isArray(details.familyMembers)) {
        // Warning or default to empty array? Frontend initializes as []
        details.familyMembers = [];
    }

    if (details.lifestyle && typeof details.lifestyle === 'object') {
        const { smoking, alcohol, activity } = details.lifestyle;
        // Basic check if needed
    }

    return await healthLib.saveHealthDetails(details);
};

export const modifyHealthDetails = async (details) => {
    if (!details) throw new Error("Health details are required for update");
    // Similar validation can be applied here
    return await healthLib.updateHealthDetails(details);
};

export const fetchNewsInsights = async () => {
    return await healthLib.getHealthNewsInsights();
};

export const askHealthAgent = async (query, details) => {
    if (!query) throw new Error("Query is required");
    return await healthLib.queryHealthAgent(query, details);
};

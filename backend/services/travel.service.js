
import * as travelLib from '../lib/travel.lib.js';

export const submitTravelDetails = async (details) => {
    if (!details) throw new Error("Travel details are required");

    // Validation based on frontend fields
    // frontend sends: intent, origin, destination, startDate, endDate, travelers, purpose, bookingStatus, tripCost, riskAppetite
    const requiredFields = [
        'intent', 'origin', 'destination',
        'startDate', 'endDate', 'travelers',
        'purpose', 'bookingStatus', 'tripCost', 'riskAppetite'
    ];

    const missing = requiredFields.filter(field => !details[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return await travelLib.saveTravelDetails(details);
};

export const modifyTravelDetails = async (details) => {
    if (!details) throw new Error("Travel details are required for update");
    return await travelLib.updateTravelDetails(details);
};

export const fetchNewsInsights = async () => {
    return await travelLib.getTravelNewsInsights();
};

export const askTravelAgent = async (query, details) => {
    if (!query) throw new Error("Query is required");
    return await travelLib.queryTravelAgent(query, details);
};

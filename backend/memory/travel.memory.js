import mongoose from 'mongoose';

// Travel collection names in MongoDB
const TRAVEL_COLLECTION_NAMES = [
    'Alpha_travel_comp',
    'bridge_travel',
    'grand_traveller',
    'mortage_travel',
    'sortedtrav_travel',
];


// ---------------------------------------------------------------------------
// Format a single plan for LLM context
// ---------------------------------------------------------------------------



function formatPlanForLLM(plan) {
    if (!plan || typeof plan !== 'object') return '';
    const lines = [];
    lines.push(`  Plan: ${plan.planId || plan.name || '—'} | ${plan.name || ''}`);
    if (plan.description) lines.push(`    Description: ${plan.description}`);
    if (plan.targetProfile) lines.push(`    Target: ${plan.targetProfile}`);
    if (plan.term) {
        const t = plan.term;
        const parts = [];
        if (t.policyDurationYears) parts.push(`${t.policyDurationYears}y`);
        if (t.maxTripDurationDays) parts.push(`max trip ${t.maxTripDurationDays}d`);
        if (parts.length) lines.push(`    Term: ${parts.join(', ')}`);
    }
    if (plan.eligibility) {
        const e = plan.eligibility;
        const parts = [];
        if (e.minAge != null || e.maxAge != null) parts.push(`Age ${e.minAge ?? '?'}-${e.maxAge ?? '?'}`);
        if (e.geographyOfResidence?.length) parts.push(e.geographyOfResidence.join(', '));
        if (e.tripTypes?.length) parts.push(`Trips: ${e.tripTypes.join(', ')}`);
        if (parts.length) lines.push(`    Eligibility: ${parts.join('; ')}`);
    }
    if (plan.coverages && typeof plan.coverages === 'object') {
        const enabled = Object.entries(plan.coverages)
            .filter(([_, v]) => v && typeof v === 'object' && v.enabled)
            .map(([k]) => k);
        if (enabled.length) lines.push(`    Coverages: ${enabled.join(', ')}`);
    }
    if (plan.exclusions?.length) {
        lines.push(`    Exclusions: ${plan.exclusions.slice(0, 5).join(', ')}${plan.exclusions.length > 5 ? '...' : ''}`);
    }
    return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Format a company-product document for LLM context
// ---------------------------------------------------------------------------
function formatDocForLLM(doc, collectionName = '') {
    if (!doc || typeof doc !== 'object') return '';
    const lines = [];
    lines.push(`Company: ${doc.company || '(from ' + collectionName + ')'}`);
    lines.push(`Product: ${doc.product || '—'}`);
    if (doc.currency) lines.push(`Currency: ${doc.currency}`);
    if (doc.notes) lines.push(`Notes: ${doc.notes}`);
    if (doc.plans?.length) {
        lines.push('Plans:');
        doc.plans.forEach(p => {
            lines.push(formatPlanForLLM(p));
        });
    }
    return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Load travel data from all travel collections and return a string for the LLM
// ---------------------------------------------------------------------------

/**
 * Load all travel company-product data from MongoDB (all travel collections)
 * and return a single string suitable for injection into an LLM prompt.
 *
 * @param {Object} [opts] - Optional: { connect: true } to ensure DB connect
 * @returns {Promise<string>} - Formatted travel product data for LLM context
 */
export async function loadTravelMemoryForLLM(opts = {}) {
    if (opts.connect) {
        const mongoUri = process.env.MONGODB_URI || "mongodb+srv://Admin:Aayu0508@cluster0.e6xave1.mongodb.net/";
        if (!mongoUri) throw new Error('MongoDB URI not found');
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(mongoUri);
        }
    }

    const db = mongoose.connection?.db;
    if (!db) throw new Error('MongoDB not connected');

    const allBlocks = [];

    for (const collName of TRAVEL_COLLECTION_NAMES) {
        const docs = await db.collection(collName).find({}).toArray();
        for (const doc of docs) {
            const toFormat = Array.isArray(doc.data) ? doc.data
                : Array.isArray(doc.products) ? doc.products
                : [doc];
            for (const d of toFormat) {
                const block = formatDocForLLM(d, collName);
                if (block?.trim()) allBlocks.push(block);
            }
        }
    }

    if (!allBlocks.length) return 'No travel insurance product data in memory.';
    return allBlocks.join('\n---\n');
}

export { TRAVEL_COLLECTION_NAMES };
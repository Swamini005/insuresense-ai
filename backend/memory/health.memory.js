import mongoose from 'mongoose';

// Health collection names in MongoDB
const HEALTH_COLLECTION_NAMES = [
    'Alpha_health_insurance',
    'bridge_health_insurance',
    'grand_health_insurance',
    'mortage_health_insurance',
    'sortedtrav_health_insurance'
];

// ---------------------------------------------------------------------------
// Format a single health plan for LLM context
// ---------------------------------------------------------------------------
function formatPlanForLLM(plan) {
    if (!plan || typeof plan !== 'object') return '';
    const lines = [];
    lines.push(`  Plan: ${plan.planId || plan.name || '—'} | ${plan.name || ''}`);
    if (plan.targetProfile) lines.push(`    Target: ${plan.targetProfile}`);
    if (plan.term) {
        const t = plan.term;
        const parts = [];
        if (t.type) parts.push(t.type);
        if (t.policyDurationYears) parts.push(`${t.policyDurationYears}y`);
        if (t.renewalType) parts.push(t.renewalType);
        if (parts.length) lines.push(`    Term: ${parts.join(', ')}`);
    }
    if (plan.sumInsuredOptions?.length) {
        const opts = plan.sumInsuredOptions.map(o => `${o.code || o.amount}: ₹${(o.amount / 100000).toFixed(1)}L`).join('; ');
        lines.push(`    Sum insured: ${opts}`);
    }
    if (plan.eligibility) {
        const e = plan.eligibility;
        const parts = [];
        if (e.entryAge) {
            const ea = e.entryAge;
            parts.push(`Age ${ea.minimum || '?'}-${ea.maximum ?? '?'}${ea.notes ? ' (' + ea.notes + ')' : ''}`);
        }
        if (e.familyMembers?.maxMembers) parts.push(`Max ${e.familyMembers.maxMembers} members`);
        if (e.disclosureMandatory) parts.push('Disclosure mandatory');
        if (parts.length) lines.push(`    Eligibility: ${parts.join('; ')}`);
    }
    if (plan.coverages && typeof plan.coverages === 'object') {
        const enabled = Object.keys(plan.coverages).filter(k => {
            const v = plan.coverages[k];
            return v && typeof v === 'object' && (v.enabled === true || v.covered === true);
        });
        if (enabled.length) lines.push(`    Coverages: ${enabled.join(', ')}`);
    }
    if (plan.uniqueFeatures && typeof plan.uniqueFeatures === 'object') {
        const u = plan.uniqueFeatures;
        const f = [];
        if (u.noRoomRentLimits) f.push('No room rent limits');
        if (u.cumulativeBonus) f.push(`Cumulative bonus: ${u.cumulativeBonus.rate || 'yes'}`);
        if (u.wellnessDiscount) f.push(`Wellness discount: ${u.wellnessDiscount.maxDiscount || 'yes'}`);
        if (u.installmentPayment?.enabled) f.push('Installment payment');
        if (f.length) lines.push(`    Features: ${f.join('; ')}`);
    }
    if (plan.waitingPeriods) {
        const w = plan.waitingPeriods;
        const parts = [];
        if (w.initial?.days) parts.push(`Initial ${w.initial.days}d`);
        if (w.specificDiseases?.months) parts.push(`Specific diseases ${w.specificDiseases.months}m`);
        if (w.preExistingDiseases?.annualPolicy) parts.push(`PED ${w.preExistingDiseases.annualPolicy}`);
        if (w.maternity?.months) parts.push(`Maternity ${w.maternity.months}m`);
        if (parts.length) lines.push(`    Waiting: ${parts.join('; ')}`);
    }
    return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Format a health company-product document for LLM context
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
        doc.plans.forEach(p => { lines.push(formatPlanForLLM(p)); });
    }
    if (doc.accidentCoverageDetails) {
        const a = doc.accidentCoverageDetails;
        const parts = [];
        if (a.scope) parts.push(a.scope);
        if (a.accidentalDeath?.payout) parts.push(`Death: ${a.accidentalDeath.payout}`);
        if (a.permanentTotalDisability?.payout) parts.push(`PTD: ${a.permanentTotalDisability.payout}`);
        if (a.valueProposition) parts.push(a.valueProposition);
        if (a.criticalFor?.length) parts.push(`Critical for: ${a.criticalFor.slice(0, 3).join('; ')}`);
        if (parts.length) lines.push('Accident cover: ' + parts.join('. '));
    }
    if (doc.lifestyleDiseaseCoverage && typeof doc.lifestyleDiseaseCoverage === 'object') {
        const conds = Object.entries(doc.lifestyleDiseaseCoverage)
            .filter(([_, v]) => v && typeof v === 'object' && v.covered)
            .map(([k, v]) => `${k} (${v.waitingPeriod || '—'})`);
        if (conds.length) lines.push('Lifestyle diseases: ' + conds.join('; '));
    }
    if (doc.limitations?.length) {
        const lim = doc.limitations.slice(0, 4).map(l => `${l.category}: ${l.description || ''}`).join(' | ');
        lines.push('Limitations: ' + lim);
    }
    if (doc.exclusions?.length) {
        lines.push('Exclusions: ' + doc.exclusions.join(', '));
    }
    if (doc.claimProcess) {
        const c = doc.claimProcess;
        const parts = [];
        if (c.cashless?.available) parts.push(`Cashless: ${c.cashless.networkHospitals || 'yes'}`);
        if (c.reimbursement?.available) parts.push('Reimbursement: yes');
        if (c.claimSettlementRatio?.percentage != null) parts.push(`CSR: ${c.claimSettlementRatio.percentage}%`);
        if (parts.length) lines.push('Claims: ' + parts.join('; '));
    }
    if (doc.suitableFor?.length) {
        lines.push('Suitable for: ' + doc.suitableFor.slice(0, 5).join(', '));
    }
    if (doc.unsuitableFor?.length) {
        lines.push('Unsuitable for: ' + doc.unsuitableFor.slice(0, 5).join(', '));
    }
    if (doc.finalVerdict) {
        const v = doc.finalVerdict;
        if (v.rating) lines.push(`Rating: ${v.rating}`);
        if (v.forWhom) lines.push('For: ' + v.forWhom);
        if (v.bottomLine) lines.push('Bottom line: ' + v.bottomLine);
        if (v.pros?.length) lines.push('Pros: ' + v.pros.slice(0, 3).join('; '));
        if (v.cons?.length) lines.push('Cons: ' + v.cons.slice(0, 3).join('; '));
    }
    if (doc.taxBenefits) {
        const t = doc.taxBenefits;
        const p = []; if (t.section) p.push(t.section); if (t.deductionSelf) p.push(`Self ₹${t.deductionSelf}`); if (t.deductionParents) p.push(`Parents ₹${t.deductionParents}`); if (t.maxTotal) p.push(`Max ₹${t.maxTotal}`);
        if (p.length) lines.push('Tax: ' + p.join(', '));
    }
    return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Load health data from all health collections and return a string for the LLM
// ---------------------------------------------------------------------------

/**
 * Load all health insurance data from MongoDB (all health collections)
 * and return a single string suitable for injection into an LLM prompt.
 *
 * @param {Object} [opts] - Optional: { connect: true } to ensure DB connect
 * @returns {Promise<string>} - Formatted health product data for LLM context
 */
export async function loadHealthMemoryForLLM(opts = {}) {
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

    for (const collName of HEALTH_COLLECTION_NAMES) {
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

    if (!allBlocks.length) return 'No health insurance product data in memory.';
    return allBlocks.join('\n---\n');
}

export { HEALTH_COLLECTION_NAMES };
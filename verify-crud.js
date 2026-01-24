
import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'http://localhost:4000/api';
const LOG_FILE = 'verification-crud.log';

try { fs.unlinkSync(LOG_FILE); } catch (e) { }

const log = (msg) => {
    fs.appendFileSync(LOG_FILE, msg + '\n');
    console.log(msg);
};

const runTest = async (name, url, method, payload) => {
    try {
        log(`\n🔵 Testing: ${name} (${method} ${url})...`);
        const res = await axios({
            method: method,
            url: url,
            data: payload
        });
        log(`✅ Passed: ${name}`);
        log(`   Response: ${JSON.stringify(res.data).substring(0, 100)}...`);
    } catch (error) {
        log(`❌ Failed: ${name}`);
        if (error.response) {
            log(`Status: ${error.response.status} ${error.response.statusText}`);
            if (typeof error.response.data === 'string' && error.response.data.trim().startsWith('<')) {
                log(`Data: HTML Response (likely error page)`);
            } else {
                log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
            }
        } else {
            log(error.message);
        }
    }
};

const main = async () => {
    log("🚀 Starting CRUD Verification...");

    // --- HEALTH ---
    const healthPayload = {
        healthIntent: "new_policy", coverageType: "self", city: "Bangalore", state: "Karnataka",
        hasPreExisting: "No", sumInsured: "5L", hospitalPref: "top_private", timeline: "immediate",
        familyMembers: [], conditions: [], lifestyle: { smoking: "no", alcohol: "no", activity: "moderate" }
    };
    await runTest('Health Create', `${BASE_URL}/health/healthdetails`, 'POST', healthPayload);
    await runTest('Health Update', `${BASE_URL}/health/healthdetails`, 'PUT', healthPayload);

    // --- INVESTMENT ---
    const investmentPayload = {
        primaryGoal: "wealth_creation", timeHorizon: "long", investmentType: "regular",
        plannedAmount: "5000", totalTargetInvestment: "500000", currentAge: "30",
        dependents: "2", annualIncome: "1000000", monthlyExpenses: "30000",
        existingLifeCover: "500000", totalCoverAmount: "0", riskAppetite: "moderate",
        liquidityNeeds: "Low", taxBracket: "20%", healthStatus: "Good", knowledgeLevel: "intermediate"
    };
    await runTest('Investment Create', `${BASE_URL}/investment/investmentdetails`, 'POST', investmentPayload);
    await runTest('Investment Update', `${BASE_URL}/investment/investmentdetails`, 'PUT', investmentPayload);

    // --- LIFE ---
    const lifePayload = {
        currentAge: "35", retirementAge: "60", dependents: { spouse: false, children: "0", parents: "0" },
        primaryGoal: "family_protection", minMonthlyExpense: "40000", annualIncome: "1500000",
        liabilities: { homeLoan: "0", carLoan: "0", other: "0" }, liquidAssets: "500000",
        existingCover: "no", employerCover: "no", marketRisk: "balanced", coverageType: "term",
        premiumTerm: "regular", tobacco: "no", alcohol: "no", medicalHistory: "none",
        occupationRisk: "low", payoutPref: "lump_sum"
    };
    await runTest('Life Create', `${BASE_URL}/life/lifedetails`, 'POST', lifePayload);
    await runTest('Life Update', `${BASE_URL}/life/lifedetails`, 'PUT', lifePayload);

    // --- TRAVEL ---
    const travelPayload = {
        intent: "planning", origin: "Mumbai", destination: "Paris", startDate: "2024-06-01",
        endDate: "2024-06-10", travelers: "solo", purpose: "leisure", activities: "none",
        healthConditions: "none", bookingStatus: "flights", tripCost: "200000",
        existingCover: false, riskAppetite: "balanced"
    };
    await runTest('Travel Create', `${BASE_URL}/travel/traveldetails`, 'POST', travelPayload);
    await runTest('Travel Update', `${BASE_URL}/travel/traveldetails`, 'PUT', travelPayload);

    log("\n✨ CRUD Verification Complete!");
};

main();

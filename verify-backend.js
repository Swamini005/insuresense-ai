
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

const runTest = async (name, fn) => {
    try {
        console.log(`\n🔵 Testing: ${name}...`);
        await fn();
        console.log(`✅ Passed: ${name}`);
    } catch (error) {
        console.error(`❌ Failed: ${name}`);
        if (error.response) {
            console.error(`Status: ${error.response.status} ${error.response.statusText}`);
            if (typeof error.response.data === 'string' && error.response.data.trim().startsWith('<')) {
                console.error(`Data: HTML Response (likely error page)`);
            } else {
                console.error(`Data:`, JSON.stringify(error.response.data, null, 2));
            }
        } else {
            console.error(error.message);
        }
    }
};

const main = async () => {
    console.log("🚀 Starting Backend Verification...");

    // 1. Health Tests
    await runTest('Health - Submit Valid Details', async () => {
        const payload = {
            healthIntent: "new_policy",
            coverageType: "self",
            city: "Bangalore",
            state: "Karnataka",
            hasPreExisting: "No",
            sumInsured: "5L",
            hospitalPref: "top_private",
            timeline: "immediate",
            familyMembers: []
        };
        const res = await axios.post(`${BASE_URL}/health/healthdetails`, payload);
        if (res.status !== 200) throw new Error("Status not 200");
    });

    await runTest('Health - Missing Fields Error', async () => {
        try {
            await axios.post(`${BASE_URL}/health/healthdetails`, { city: "Bangalore" });
            throw new Error("Should have failed");
        } catch (error) {
            if (error.response && error.response.status === 500) return; // or 400 if I changed status code
            throw error;
        }
    });

    await runTest('Health Agent - Query', async () => {
        const res = await axios.post(`${BASE_URL}/health/healthagent`, { query: "Best health plan?" });
        if (!res.data.response) throw new Error("No response from agent");
    });


    // 2. Investment Tests
    await runTest('Investment - Submit Valid Details', async () => {
        const payload = {
            primaryGoal: "wealth_creation",
            timeHorizon: "long",
            investmentType: "regular",
            plannedAmount: "5000",
            currentAge: "30",
            annualIncome: "1000000",
            monthlyExpenses: "30000",
            riskAppetite: "moderate"
        };
        const res = await axios.post(`${BASE_URL}/investment/investmentdetails`, payload);
        if (res.status !== 200) throw new Error("Status not 200");
    });

    await runTest('Investment - Missing Fields Error', async () => {
        try {
            await axios.post(`${BASE_URL}/investment/investmentdetails`, { primaryGoal: "wealth" });
            throw new Error("Should have failed");
        } catch (error) {
            if (error.response && error.response.status === 500) return;
            throw error;
        }
    });

    await runTest('Investment Agent - Query', async () => {
        const res = await axios.post(`${BASE_URL}/investment/investmentagent`, { query: "Stock market trends?" });
        // Investment agent validation might return different structure
        if (!res.data.text && !res.data.response) throw new Error("No response from agent");
    });


    // 3. Life Tests
    await runTest('Life - Submit Valid Details', async () => {
        const payload = {
            currentAge: "35",
            primaryGoal: "family_protection",
            annualIncome: "1500000",
            minMonthlyExpense: "40000",
            marketRisk: "balanced",
            occupationRisk: "low",
            payoutPref: "lump_sum"
        };
        const res = await axios.post(`${BASE_URL}/life/lifedetails`, payload);
        if (res.status !== 200) throw new Error("Status not 200");
    });

    await runTest('Life Agent - Query', async () => {
        const res = await axios.post(`${BASE_URL}/life/lifeagent`, { query: "Life insurance for smokers?" });
        if (!res.data.response) throw new Error("No response from agent");
    });


    // 4. Travel Tests
    await runTest('Travel - Submit Valid Details', async () => {
        const payload = {
            intent: "planning",
            origin: "Mumbai",
            destination: "Paris",
            startDate: "2024-06-01",
            endDate: "2024-06-10",
            travelers: "solo",
            purpose: "leisure",
            bookingStatus: "flights",
            tripCost: "200000",
            riskAppetite: "balanced"
        };
        const res = await axios.post(`${BASE_URL}/travel/traveldetails`, payload);
        if (res.status !== 200) throw new Error("Status not 200");
    });

    await runTest('Travel - Missing Fields Error', async () => {
        try {
            await axios.post(`${BASE_URL}/travel/traveldetails`, { origin: "Mumbai" });
            throw new Error("Should have failed");
        } catch (error) {
            if (error.response && error.response.status === 500) return;
            throw error;
        }
    });

    await runTest('Travel Agent - Query', async () => {
        const res = await axios.post(`${BASE_URL}/travel/travelagent`, { query: "Do I need visa for France?" });
        if (!res.data.response) throw new Error("No response from agent");
    });

    console.log("\n✨ Verification Complete!");
};

main();

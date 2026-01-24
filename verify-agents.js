
import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'http://localhost:4000/api';
const LOG_FILE = 'verification.log';

// Clear log file
try { fs.unlinkSync(LOG_FILE); } catch (e) { }

const log = (msg) => {
    fs.appendFileSync(LOG_FILE, msg + '\n');
    console.log(msg); // Keep console for realtime feedback (even if garbled)
};

const runTest = async (name, url, payload) => {
    try {
        log(`\n🔵 Testing: ${name} (${url})...`);
        const res = await axios.post(url, payload);
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
    log("🚀 Starting Agent Verification...");

    await runTest('Health Agent', `${BASE_URL}/health/healthagent`, { query: "Health plan?" });
    await runTest('Investment Agent', `${BASE_URL}/investment/investmentagent`, { query: "Stocks?" });
    await runTest('Life Agent', `${BASE_URL}/life/lifeagent`, { query: "Life insurance?" });
    await runTest('Travel Agent', `${BASE_URL}/travel/travelagent`, { query: "Visa?" });
    await runTest('Chat Agent', `${BASE_URL}/chat`, { query: "Hello?" });

    log("\n✨ Verification Complete!");
};

main();

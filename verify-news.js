
import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'http://localhost:4000/api';
const LOG_FILE = 'verification-news.log';

try { fs.unlinkSync(LOG_FILE); } catch (e) { }

const log = (msg) => {
    fs.appendFileSync(LOG_FILE, msg + '\n');
    console.log(msg);
};

const runTest = async (name, url) => {
    try {
        log(`\n🔵 Testing: ${name} (GET ${url})...`);
        const res = await axios.get(url);
        log(`✅ Passed: ${name}`);
        // Log truncated response to verify content type
        const dataStr = JSON.stringify(res.data);
        log(`   Response: ${dataStr.substring(0, 150)}...`);
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
    log("🚀 Starting News Verification...");

    await runTest('Health News', `${BASE_URL}/health/healthinsurancenews`);
    await runTest('Investment News', `${BASE_URL}/investment/investmentnewsinsights`);
    await runTest('Life News', `${BASE_URL}/life/lifeinsurencenews`);
    await runTest('Travel News', `${BASE_URL}/travel/travelinsurancenewsinsights`);

    log("\n✨ News Verification Complete!");
};

main();

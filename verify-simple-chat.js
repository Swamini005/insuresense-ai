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
            console.error(`Data:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
};

const main = async () => {
    console.log("🚀 Starting Simple Chat Verification...");

    await runTest('Chat - Send "Hello"', async () => {
        const payload = { query: "Hello, who are you?" };
        const res = await axios.post(`${BASE_URL}/chat`, payload);

        if (res.status !== 200) throw new Error("Status not 200");
        if (!res.data.response) throw new Error("No response field in data");

        console.log("Response from Chat:", res.data.response);
    });

    console.log("\n✨ Verification Complete!");
};

main();

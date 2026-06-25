

const BASE_URL = 'http://localhost:3000/api';

const endpoints = [
    { name: 'Auth - Signup (POST)', method: 'POST', url: '/auth/signup', body: { email: `test_${Date.now()}@test.com`, password: 'password123', name: 'Test User' } },
    { name: 'Auth - Login (POST)', method: 'POST', url: '/auth/login', dependsOnLogin: true },
    { name: 'Auth - Me (GET)', method: 'GET', url: '/auth/me', requiresAuth: true },
    
    { name: 'Health - News (GET)', method: 'GET', url: '/health/healthinsurancenews' },
    { name: 'Health - Submit Details (POST)', method: 'POST', url: '/health/healthdetails', requiresAuth: true, body: { age: 30, preExisting: false } },
    { name: 'Health - Agent Query (POST)', method: 'POST', url: '/health/healthagent', requiresAuth: true, body: { query: 'Best health plans?' } },

    { name: 'Travel - News (GET)', method: 'GET', url: '/travel/travelinsurancenewsinsights' },
    { name: 'Travel - Submit Details (POST)', method: 'POST', url: '/travel/traveldetails', requiresAuth: true, body: { destination: 'Paris', durationDays: 7 } },
    { name: 'Travel - Agent Query (POST)', method: 'POST', url: '/travel/travelagent', requiresAuth: true, body: { query: 'Best travel plans?' } },

    { name: 'Life - News (GET)', method: 'GET', url: '/life/lifeinsurencenews' },
    { name: 'Life - Submit Details (POST)', method: 'POST', url: '/life/lifedetails', requiresAuth: true, body: { dependents: 2, income: 50000 } },
    { name: 'Life - Agent Query (POST)', method: 'POST', url: '/life/lifeagent', requiresAuth: true, body: { query: 'Best term life plans?' } },

    { name: 'Investment - News (GET)', method: 'GET', url: '/investment/investmentnewsinsights' },
    { name: 'Investment - Submit Details (POST)', method: 'POST', url: '/investment/investmentdetails', requiresAuth: true, body: { riskTolerance: 'medium', goal: 'retirement' } },
    { name: 'Investment - Agent Query (POST)', method: 'POST', url: '/investment/investmentagent', requiresAuth: true, body: { query: 'Best index funds?' } },

    { name: 'Crypto - News (GET)', method: 'GET', url: '/crypto/cryptonewsinsights' },
    { name: 'Crypto - Submit Details (POST)', method: 'POST', url: '/crypto/cryptodetails', requiresAuth: true, body: { experienceLevel: 'beginner' } },
    { name: 'Crypto - Agent Query (POST)', method: 'POST', url: '/crypto/cryptoagent', requiresAuth: true, body: { query: 'Is Bitcoin good now?' } },

    { name: 'Chat - Status (GET)', method: 'GET', url: '/chat/chatagent' },
    { name: 'Chat - Query (POST)', method: 'POST', url: '/chat', body: { query: 'Hello' } }
];

async function checkEndpoints() {
    console.log('🚀 Starting Endpoint Check...\n');
    let token = null;
    let loginEmail = null;
    let loginPassword = null;

    for (const endpoint of endpoints) {
        try {
            let body = endpoint.body;
            
            if (endpoint.dependsOnLogin && loginEmail) {
                body = { email: loginEmail, password: loginPassword };
            }

            const headers = { 'Content-Type': 'application/json' };
            if (endpoint.requiresAuth) {
                if (!token) {
                    console.log(`⚠️  ${endpoint.name} - SKIPPED (Requires Auth, but no token)`);
                    continue;
                }
                headers['Authorization'] = `Bearer ${token}`;
            }

            const start = Date.now();
            const response = await fetch(`${BASE_URL}${endpoint.url}`, {
                method: endpoint.method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });
            const time = Date.now() - start;

            // Wait a little before parsing so we don't spam
            const text = await response.text();
            
            if (response.ok) {
                console.log(`✅ [${response.status}] ${endpoint.name} (${time}ms)`);
                
                // Save token from signup/login to test protected routes
                if (endpoint.url === '/auth/signup' || endpoint.url === '/auth/login') {
                    const data = JSON.parse(text);
                    if (data.token) {
                        token = data.token;
                        if (endpoint.url === '/auth/signup') {
                            loginEmail = body.email;
                            loginPassword = body.password;
                        }
                    }
                }
            } else {
                console.log(`❌ [${response.status}] ${endpoint.name} (${time}ms)`);
                console.log(`   Error: ${text.substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`💥 [ERROR] ${endpoint.name} - ${error.message}`);
        }
    }
    console.log('\n🏁 Endpoint check complete!');
}

checkEndpoints();

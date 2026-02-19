const fetch = global.fetch || require('node-fetch');

// Use IPv4 loopback to avoid node 17+ localhost resolution issues
const BASE_URL = 'http://127.0.0.1:5000/api';

async function testEndpoint(name, fn) {
    console.log(`\n=== Testing ${name} ===`);
    try {
        await fn();
        console.log(`✅ ${name} Passed`);
    } catch (error) {
        console.error(`❌ ${name} Failed:`, error.message);
        if (error.cause) console.error('Cause:', error.cause);
        if (error.response) {
            try {
                const text = await error.response.text();
                // console.error('Response Body:', text.substring(0, 500)); // Commented out to reduce noise if needed
            } catch (e) {
                console.error('Could not read response body');
            }
        }
    }
}

async function verifyAI() {
    console.log('Starting AI Verification (Target: ' + BASE_URL + ')...');

    // 1. Recommendations (Database Driven)
    await testEndpoint('Recommendations API', async () => {
        const url = `${BASE_URL}/ai/recommendations?weather=Sunny`;
        console.log(`Fetching ${url}`);
        const res = await fetch(url);
        if (!res.ok) {
            const error = new Error(`Status ${res.status} ${res.statusText}`);
            error.response = res;
            throw error;
        }
        const data = await res.json();
        console.log(`Received ${Array.isArray(data) ? data.length : 'invalid'} recommendations`);
        if (!Array.isArray(data)) throw new Error('Response is not an array');
    });

    // 2. Chat (Gemini Driven)
    await testEndpoint('AI Chat API', async () => {
        const payload = {
            message: "Hello, suggests some places in Kerala",
            history: [],
            context: { weather: "Sunny", time: "Morning", location: "Kochi" }
        };
        const url = `${BASE_URL}/ai/chat`;
        console.log(`Posting to ${url}`);
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const error = new Error(`Status ${res.status} ${res.statusText}`);
            error.response = res;
            throw error;
        }
        const data = await res.json();
        console.log('Chat Reply:', data.reply ? data.reply.substring(0, 100) + '...' : 'No reply');
    });

    // 3. Trip Planner (Gemini Driven)
    await testEndpoint('AI Trip Planner', async () => {
        const payload = {
            duration: "3 days",
            budget: "Mid-range",
            travelers: "Couple",
            interests: ["Beaches", "Culture"]
        };
        const url = `${BASE_URL}/itinerary/ai`;
        console.log(`Posting to ${url}`);
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const error = new Error(`Status ${res.status} ${res.statusText}`);
            error.response = res;
            throw error;
        }
        const data = await res.json();
        console.log('Itinerary Title:', data.title);
    });
}

verifyAI();

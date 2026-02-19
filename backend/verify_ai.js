const fetch = require('node-fetch'); // Ensure node-fetch is available or use native fetch if node version >= 18

async function verify() {
    const baseUrl = 'http://localhost:5000/api';
    console.log('--- Verifying AI Recommendations (DB Strategy) ---');
    try {
        const res = await fetch(`${baseUrl}/ai/recommendations?weather=Sunny`);
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Result:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    } catch (e) {
        console.error('Recommendations Error:', e.message);
    }

    console.log('\n--- Verifying AI Chat (Gemini) ---');
    try {
        const res = await fetch(`${baseUrl}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: "Suggest a nice beach in Kerala",
                history: []
            })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Chat Error:', e.message);
    }
}

verify();

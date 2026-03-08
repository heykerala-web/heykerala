const axios = require('axios');

async function benchmark() {
    const baseUrl = 'http://127.0.0.1:5000/api';
    const endpoints = [
        { name: 'AI Recommendations', url: '/ai/recommendations' },
        { name: 'Trending Places', url: '/places/trending' },
        { name: 'Stay Page Fetch', url: '/stays' }
    ];

    console.log('=== PERFORMANCE BENCHMARK ===\n');

    for (const ep of endpoints) {
        try {
            const start = Date.now();
            await axios.get(`${baseUrl}${ep.url}`);
            const duration = Date.now() - start;
            console.log(`${ep.name.padEnd(20)}: ${duration}ms ${duration < 200 ? '✅ (FAST)' : '⚠️ (SLOW)'}`);
        } catch (err) {
            console.error(`${ep.name.padEnd(20)}: FAILED (${err.code || err.message})`);
        }
    }
}

benchmark();

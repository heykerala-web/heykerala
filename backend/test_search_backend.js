const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 5000;
const API_PATH = '/api/ai/search';

function fetch(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, json: () => Promise.resolve(json), text: () => Promise.resolve(data) });
                } catch (e) {
                    resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, json: () => Promise.reject(e), text: () => Promise.resolve(data) });
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function testSearch(query, type) {
    console.log(`\nTesting search with query="${query}" and type="${type}"...`);
    try {
        const url = `http://${API_HOST}:${API_PORT}${API_PATH}?q=${encodeURIComponent(query)}&type=${type}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Error: ${response.status}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log(`Found ${data.length} results.`);
        if (data.length > 0) {
            console.log('Sample result:', JSON.stringify(data[0], null, 2));
            // Check if types are correct
            const types = [...new Set(data.map(d => d.type))];
            console.log('Result types found:', types);
        } else {
            console.log('No results found.');
        }
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

async function runTests() {
    // 1. Test All (should return mix if matches found)
    await testSearch('kerala', 'all');

    // 2. Test Place (should only return places)
    await testSearch('munnar', 'place');

    // 3. Test Stay (should only return stays)
    await testSearch('hotel', 'stay');

    // 4. Test Event (should only return events)
    await testSearch('festival', 'event');
}

runTests();

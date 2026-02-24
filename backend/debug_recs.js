const fetch = global.fetch || require('node-fetch');
const BASE_URL = 'http://127.0.0.1:5000/api';

async function checkRecs() {
    const url = `${BASE_URL}/ai/recommendations?weather=Sunny&category=Adventure`;
    console.log(`Fetching ${url}`);
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

checkRecs();

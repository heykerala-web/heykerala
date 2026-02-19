const http = require('http');
const fs = require('fs');

const API_HOST = 'localhost';
const API_PORT = 5000;
const API_PATH = '/api/ai/search';
const QUERY = 'kerala';
const TYPE = 'all';

function fetch(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

async function runTest() {
    try {
        const url = `http://${API_HOST}:${API_PORT}${API_PATH}?q=${encodeURIComponent(QUERY)}&type=${TYPE}`;
        console.log(`Fetching ${url}...`);

        const response = await fetch(url);

        const output = {
            statusCode: response.statusCode,
            data: response.data
        };

        fs.writeFileSync('result.json', JSON.stringify(output, null, 2));
        console.log('Result written to result.json');

    } catch (error) {
        const errorLog = {
            message: error.message,
            stack: error.stack,
            code: error.code,
            address: error.address,
            port: error.port
        };
        console.error('Test failed:', errorLog);
        fs.writeFileSync('result.json', JSON.stringify({ error: errorLog }, null, 2));
    }
}

runTest();

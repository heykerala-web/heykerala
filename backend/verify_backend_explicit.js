const http = require('http');
const fs = require('fs');

const API_HOST = 'localhost';
const API_PORT = 5000;
const API_PATH = '/api/ai/search';
const QUERY = 'kerala';
const TYPE = 'all';

function fetch(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
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
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function runTest() {
    try {
        const url = `http://${API_HOST}:${API_PORT}${API_PATH}?q=${encodeURIComponent(QUERY)}&type=${TYPE}`;
        const response = await fetch(url);

        const output = {
            statusCode: response.statusCode,
            data: response.data
        };

        fs.writeFileSync('result.json', JSON.stringify(output, null, 2));
        console.log('Result written to result.json');

    } catch (error) {
        fs.writeFileSync('result.json', JSON.stringify({ error: error.message }, null, 2));
        console.error('Error written to result.json');
    }
}

runTest();

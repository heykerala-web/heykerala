const http = require('http');

// Simple script to test the chat API
const data = JSON.stringify({
    history: [],
    message: "Hello! What is special about Kerala?",
    context: {
        time: "10:00 AM",
        location: "Test Script",
        weather: "Sunny"
    }
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:');
        try {
            console.log(JSON.stringify(JSON.parse(responseData), null, 2));
        } catch (e) {
            console.log(responseData);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

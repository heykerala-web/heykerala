const http = require('http');

// Simple script to test the chat API with streaming
const data = JSON.stringify({
    history: [],
    message: "Tell me a short joke about Kerala",
    context: {
        time: "10:00 AM",
        location: "Test Script",
        weather: "Sunny"
    }
});

const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    res.on('data', (chunk) => {
        // Just print the chunk as string to visualize the stream
        process.stdout.write(chunk.toString());
    });

    res.on('end', () => {
        console.log('\n--- End of Stream ---');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

const http = require('http');

function checkPort(port) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}`, (res) => {
            console.log(`Port ${port} is alive. Status: ${res.statusCode}`);
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const title = data.match(/<title>(.*?)<\/title>/);
                console.log(`Port ${port} Title: ${title ? title[1] : 'No title'}`);
                // Check if it looks like a nextjs app
                const hasNext = data.includes('next');
                console.log(`Port ${port} has 'next' content: ${hasNext}`);
                resolve(true);
            });
        });

        req.on('error', (err) => {
            console.log(`Port ${port} error: ${err.message}`);
            resolve(false);
        });
    });
}

async function check() {
    console.log("Checking ports...");
    await checkPort(3000);
    await checkPort(3001);
    await checkPort(3002);
}

check();

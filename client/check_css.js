const http = require('http');

function checkCss(port) {
    console.log(`Checking CSS on port ${port}...`);
    http.get(`http://localhost:${port}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const hasCss = data.includes('.css');
            const cssLinks = data.match(/<link[^>]+href="[^"]+\.css"/g);
            console.log(`Port ${port} has CSS links: ${hasCss}`);
            if (cssLinks) {
                console.log(`Port ${port} CSS links found: ${cssLinks.length}`);
                cssLinks.forEach(link => console.log(link));
            } else {
                console.log(`Port ${port} NO CSS links found!`);
            }
        });
    }).on('error', (err) => {
        console.log(`Port ${port} error: ${err.message}`);
    });
}

checkCss(3000);
checkCss(3001);

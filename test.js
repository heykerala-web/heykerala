const fs = require('fs');
async function checkPlaces() {
    try {
        const res = await fetch('http://localhost:5000/api/ai/recommendations?sessionId=test');
        const data = await res.json();
        fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}
checkPlaces();

const http = require('http');

const url = 'http://localhost:5000/api/places?type=ThingsToDo&limit=50';

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Status:', res.statusCode);
            console.log('Success:', json.success);
            console.log('Count:', json.data ? json.data.length : 0);
            if (json.data && json.data.length > 0) {
                console.log('Sample:', json.data[0].name, json.data[0].category);
            } else {
                console.log('Full Response:', data);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw Data:', data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

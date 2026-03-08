const fs = require('fs');
async function test() {
    const res = await fetch('http://localhost:5000/uploads/1772993150529-991254822.jpg');
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
}
test();

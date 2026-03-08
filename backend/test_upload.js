
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function testUpload() {
    const filePath = path.join(__dirname, 'test_image.png');
    // Create a dummy image if not exists
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'dummy image content');
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));
    form.append('placeId', '65e7ba1e1234567890abcdef'); // Dummy ID
    form.append('caption', 'Test Upload');
    form.append('targetType', 'place');

    try {
        console.log('Attempting upload to http://localhost:5000/api/place-photos/upload...');
        const response = await axios.post('http://localhost:5000/api/place-photos/upload', form, {
            headers: {
                ...form.getHeaders(),
                // We need a token here if it's protected
                'Authorization': `Bearer ${process.env.TEST_TOKEN}`
            }
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Upload failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
    }
}

testUpload();

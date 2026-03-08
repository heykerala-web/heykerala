
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function testUpload() {
    const filePath = path.join(__dirname, 'repro_image.png');
    // Create a dummy image
    fs.writeFileSync(filePath, 'dummy image content');

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    try {
        console.log('Attempting upload to http://localhost:5000/api/upload...');
        const response = await axios.post('http://localhost:5000/api/upload', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Response Success:', response.data);
    } catch (error) {
        console.error('Upload failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
    } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
}

testUpload();

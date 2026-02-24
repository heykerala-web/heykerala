
const axios = require('axios');

async function testForgotPassword() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
            email: 'binsway@gmail.com'
        });
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', error.response?.data);
        console.error('Error Message:', error.message);
    }
}

testForgotPassword();

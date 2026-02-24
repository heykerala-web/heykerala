
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Load env from backend
dotenv.config({ path: './backend/.env' });

// Define User Schema (minimal)
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date
});
const User = mongoose.model('User', userSchema);

async function testFullFlow() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'binsway@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.error('User not found');
            return;
        }

        console.log('1. User found:', user.email);

        // Simulate Forgot Password
        const resetToken = crypto.randomBytes(20).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log('2. Reset token generated and saved:', resetToken);
        console.log('3. Hashed token in DB:', hashedToken);

        // Simulate Reset Password
        const newPassword = 'newPassword123!';
        const tokenToVerify = resetToken;

        const hashedToVerify = crypto.createHash('sha256').update(tokenToVerify).digest('hex');
        console.log('4. Verifying token:', tokenToVerify);
        console.log('5. Hashed token to verify:', hashedToVerify);

        const foundUser = await User.findOne({
            resetPasswordToken: hashedToVerify,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!foundUser) {
            console.error('❌ Error: Token not found or expired in DB');
            const debugUser = await User.findOne({ email });
            console.log('Debug Token in DB:', debugUser.resetPasswordToken);
            console.log('Debug Expire in DB:', debugUser.resetPasswordExpire);
            console.log('Current Date:', new Date());
            return;
        }

        console.log('6. User found with token!');

        foundUser.password = await bcrypt.hash(newPassword, 10);
        foundUser.resetPasswordToken = undefined;
        foundUser.resetPasswordExpire = undefined;
        await foundUser.save();

        console.log('✅ Success: Password reset successfully simulated!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testFullFlow();

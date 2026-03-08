import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendBookingConfirmationEmail = async (userEmail: string, userName: string, bookingDetails: any) => {
    try {
        const mailOptions = {
            from: `"Hey Kerala" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Booking Confirmed - Hey Kerala',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #00c8ff;">Booking Confirmed!</h2>
                    <p>Hello ${userName},</p>
                    <p>Your booking for <strong>${bookingDetails.stayName}</strong> has been confirmed successfully.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <h3>Booking Details:</h3>
                    <ul>
                        <li><strong>Booking ID:</strong> ${bookingDetails.id}</li>
                        <li><strong>Dates:</strong> ${new Date(bookingDetails.checkIn).toLocaleDateString()} to ${new Date(bookingDetails.checkOut).toLocaleDateString()}</li>
                        <li><strong>Amount Paid:</strong> ₹${bookingDetails.totalPrice}</li>
                    </ul>
                    <p>We look forward to hosting you!</p>
                    <p>Best Regards,<br/>Team Hey Kerala</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log(`Confirmation email sent to ${userEmail}`);
        } else {
            console.warn('Email credentials not provided, skipping email send.');
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

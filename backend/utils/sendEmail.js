const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter using environment variables
    // IMPORTANT: Ensure SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD are set in .env
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com", // Default to Gmail if not set
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false // Generic fix for some local dev environments
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Tidjob Lokal'} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // Optional: if you want to send HTML emails later
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;

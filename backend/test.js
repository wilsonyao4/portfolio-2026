require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("Testing with Email:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("❌ FAILED TO CONNECT TO GMAIL:");
        console.error(error.message);
    } else {
        console.log("✅ SUCCESS! Gmail accepted your credentials.");
    }
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Gmail Connection Error:", error);
    } else {
        console.log("✅ Gmail Connection Successful. Ready to send emails.");
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required.' });
        if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required.' });
        if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required.' });
        if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email address.' });

        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`, 
            replyTo: email, 
            to: process.env.EMAIL_USER, 
            subject: `New Portfolio Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, 
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    
                    <div style="background-color: #000000; padding: 20px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 0.5px;">New Message from My Website Contact Form</h2>
                    </div>
                    
                    <div style="padding: 30px;">
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                            <tr>
                                <td style="padding-bottom: 15px;">
                                    <span style="color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Sender Name</span><br>
                                    <strong style="color: #111111; font-size: 16px;">${name}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span style="color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email Address</span><br>
                                    <a href="mailto:${email}" style="color: #A4133C; font-size: 16px; text-decoration: none; font-weight: bold;">${email}</a>
                                </td>
                            </tr>
                        </table>

                        <div style="margin-top: 10px;">
                            <span style="color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</span>
                            <div style="margin-top: 8px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #A4133C; border-radius: 4px; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
                        </div>

                    </div>

                    <div style="background-color: #f5f5f7; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="margin: 0; color: #888888; font-size: 12px;">This email was generated automatically from your portfolio website.</p>
                    </div>

                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ success: 'Message sent successfully!' });

    } catch (error) {
        console.error('Email send failed:', error);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Backend server is actively running on port ${PORT}`);
});
const route = require('express').Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();  // Load environment variables

// Disable SSL certificate validation for development environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 

// Middleware for parsing JSON bodies
route.use(bodyParser.json());

// Create a Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail's SMTP service
    auth: {
        user: process.env.GMAIL_USER,   // Your Gmail email
        pass: process.env.GMAIL_PASSWORD // Your Gmail app password
    }
});

// Route to handle the contact form submission
route.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    // Validation of the form data
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Setup the email options
        const mailOptions = {
            from: process.env.GMAIL_USER, // Sender email
            to: process.env.ADMIN_EMAIL,  // Admin email address
            subject: 'New Contact Form Submission',
            html: `
                <h1>Contact Form Submission</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        };

        // Send the email using Nodemailer
        await transporter.sendMail(mailOptions);

        // Send success response
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = route;  // Export the route object

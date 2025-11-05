// Rena Hem & Kontorsservice - Email Server
// This server handles contact form submissions using SendGrid

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Configure SendGrid with API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from public directory

// API endpoint to handle contact form submissions
app.post('/api/send-email', async (req, res) => {
    const { fromName, fromEmail, phone, messageContent } = req.body;

    // Validate required fields
    if (!fromName || !fromEmail || !messageContent) {
        return res.status(400).json({
            message: 'Namn, e-post och meddelande är obligatoriska.'
        });
    }

    // Prepare email content
    const msg = {
        to: process.env.EMAIL_TO, // Your email address (recipient)
        from: {
            name: 'Rena Hem Hemsida',
            email: process.env.VERIFIED_SENDER, // Your verified sender email in SendGrid
        },
        replyTo: fromEmail, // Customer's email as reply-to address
        subject: `Ny förfrågan från ${fromName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e4a89; border-bottom: 3px solid #1e4a89; padding-bottom: 10px;">
                    Ny förfrågan från hemsidan
                </h2>

                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 10px 0;">
                        <strong style="color: #1e4a89;">Namn:</strong> ${fromName}
                    </p>
                    <p style="margin: 10px 0;">
                        <strong style="color: #1e4a89;">E-post:</strong>
                        <a href="mailto:${fromEmail}" style="color: #1e4a89;">${fromEmail}</a>
                    </p>
                    ${phone ? `
                        <p style="margin: 10px 0;">
                            <strong style="color: #1e4a89;">Telefon:</strong> ${phone}
                        </p>
                    ` : ''}
                </div>

                <div style="margin: 20px 0;">
                    <strong style="color: #1e4a89;">Meddelande:</strong>
                    <p style="white-space: pre-wrap; background-color: #ffffff; padding: 15px; border-left: 4px solid #1e4a89; margin-top: 10px;">
                        ${messageContent}
                    </p>
                </div>

                <hr style="border: none; border-top: 1px solid #e0f2fe; margin: 20px 0;">

                <p style="color: #6b7280; font-size: 12px; text-align: center;">
                    Detta meddelande skickades från kontaktformuläret på renahem.se
                </p>
            </div>
        `,
    };

    // Send email using SendGrid
    try {
        await sgMail.send(msg);
        console.log(`✅ Email sent successfully from ${fromEmail}`);

        res.status(200).json({
            message: 'E-post har skickats framgångsrikt!'
        });
    } catch (error) {
        console.error('❌ Error sending email with SendGrid:', error);

        // Log detailed error if available
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }

        res.status(500).json({
            message: 'Ett internt fel uppstod. Försök igen senare.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured with SendGrid`);
    console.log(`📂 Serving static files from 'public' directory`);

    // Warn if environment variables are not set
    if (!process.env.SENDGRID_API_KEY) {
        console.warn('⚠️  Warning: SENDGRID_API_KEY not set in .env file');
    }
    if (!process.env.EMAIL_TO) {
        console.warn('⚠️  Warning: EMAIL_TO not set in .env file');
    }
    if (!process.env.VERIFIED_SENDER) {
        console.warn('⚠️  Warning: VERIFIED_SENDER not set in .env file');
    }
});

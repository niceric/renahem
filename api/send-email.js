// server.js

// 1. Importera paket
require('dotenv').config();
const express = require('express');
const sgMail = require('@sendgrid/mail'); // Importera SendGrid-paketet
const cors = require('cors');

// 2. Skapa en Express-applikation
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Konfigurera SendGrid med din API-nyckel
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Sätt API-nyckeln en gång

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Skapa API-endpoint
app.post('/api/send-email', async (req, res) => {
    const { fromName, fromEmail, messageContent } = req.body;

    if (!fromName || !fromEmail || !messageContent) {
        return res.status(400).json({ message: 'Alla fält är obligatoriska.' });
    }

    // 6. Definiera innehållet i mejlet (SendGrid-format)
    const msg = {
        to: process.env.EMAIL_TO, // Mottagare (din e-post)
        from: {
            name: 'Ren & Fin Hemsida', // Namn som visas i inkorgen
            email: process.env.VERIFIED_SENDER, // Din verifierade avsändare
        },
        replyTo: fromEmail, // VIKTIGT: Sätter kundens e-post som svarsadress
        subject: `Ny förfrågan från ${fromName}`,
        html: `
            <h2>Ny förfrågan har inkommit!</h2>
            <p><strong>Namn:</strong> ${fromName}</p>
            <p><strong>E-post (för svar):</strong> ${fromEmail}</p>
            <hr>
            <p><strong>Meddelande:</strong></p>
            <p style="white-space: pre-wrap;">${messageContent}</p>
        `,
    };

    // 7. Skicka mejlet med SendGrid
    try {
        await sgMail.send(msg);
        res.status(200).json({ message: 'E-post har skickats framgångsrikt!' });
    } catch (error) {
        console.error('Fel vid skickande av e-post med SendGrid:', error);
        
        // SendGrid ger detaljerade felmeddelanden som är bra att logga
        if (error.response) {
            console.error(error.response.body)
        }
        
        res.status(500).json({ message: 'Ett internt fel uppstod. Försök igen senare.' });
    }
});

// 8. Starta servern
app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);

});
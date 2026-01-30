require('dotenv').config();
const express = require('express');
const AfricasTalking = require('africastalking');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. DYNAMIC CONFIGURATION
// Ensure your Render Environment Variables are: 
// AT_USERNAME (your custom app name, NOT 'sandbox')
// AT_API_KEY (the key from that specific green app)
const credentials = {
    apiKey: process.env.AT_API_KEY, 
    username: process.env.AT_USERNAME
};

// Log credentials status on startup (Safety check)
console.log(`Starting server with Username: ${credentials.username || 'MISSING'}`);

const AT = AfricasTalking(credentials);
const sms = AT.SMS;

// Admin number in International Format
const MY_PRIVATE_NUMBER = '+254759277409'; 

app.post('/send-otp', async (req, res) => {
    const { otp } = req.body; 
    
    // Pro-Tip: If carrier blocks "Airtel", use a simpler test message first
    const officialMsg = `CongoCash OTP: ${otp}. Do not share this code. Bw6j5XNu+9/`;

    try {
        const result = await sms.send({
            to: [MY_PRIVATE_NUMBER],
            message: officialMsg
        });

        // Detailed logging for Render
        const recipient = result.SMSMessageData.Recipients[0];
        console.log(`Response from AT: Status=${recipient.status}, Code=${recipient.statusCode}, Cost=${recipient.cost}`);

        if (recipient.statusCode === 101 || recipient.statusCode === 102) {
            res.status(200).json({ success: true, message: "Sent to Gateway" });
        } else {
            // This catches cases like 405 (No Balance) or 402 (Invalid Sender ID)
            res.status(400).json({ success: false, code: recipient.statusCode });
        }

    } catch (err) {
        // This catches the 401 Unauthorized Error
        console.error("CRITICAL SMS ERROR:", err.message);
        res.status(401).json({ success: false, error: "Authentication Failed with AT" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`CongoCash Admin Server running on port ${PORT}`));
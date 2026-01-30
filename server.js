require('dotenv').config();
const express = require('express');
const AfricasTalking = require('africastalking');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. LIVE CONFIGURATION
// Ensure Render Env Vars: AT_USERNAME is 'multizzy' and AT_API_KEY is your LIVE key
const credentials = {
    apiKey: process.env.AT_API_KEY, 
    username: process.env.AT_USERNAME
};

const MY_PRIVATE_NUMBER = '+254754670482'; 
const AT = AfricasTalking(credentials);
const sms = AT.SMS;

app.post('/send-otp', async (req, res) => {
    const { otp } = req.body; 
    
    // Professional message format (avoiding 'Airtel' keywords to prevent spam blocks)
    const officialMsg = `Newton, your CongoCash verification code is: ${otp}. Valid for 5 minutes.`;

    try {
        const result = await sms.send({
            to: [MY_PRIVATE_NUMBER],
            message: officialMsg
        });

        // Detailed logging to help you see costs and network status
        const recipient = result.SMSMessageData.Recipients[0];
        console.log(`--- SMS DISPATCH REPORT ---`);
        console.log(`Target: ${recipient.number}`);
        console.log(`Status: ${recipient.status}`);
        console.log(`Status Code: ${recipient.statusCode}`);
        console.log(`Cost: ${recipient.cost}`);
        console.log(`---------------------------`);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("LIVE SMS ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Render dynamic port binding
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`CongoCash Production Server active on port ${PORT}`);
    console.log(`Operating as user: ${credentials.username}`);
});
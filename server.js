require('dotenv').config();
const express = require('express');
const AfricasTalking = require('africastalking');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// LIVE CONFIGURATION
const credentials = {
    apiKey: 'atsk_cb575d01be9fb2f94828bc0a452f035c3492cb186f56cfe0f16fbbb9e22d7120f3ce84d6', 
    username: 'multizzy'
};

const MY_PRIVATE_NUMBER = '+254708720109'; 
const AT = AfricasTalking(credentials);
const sms = AT.SMS;

app.post('/send-otp', async (req, res) => {
    const { otp } = req.body; 
    
    // The exact Airtel format you requested
    const officialMsg = `<#> Your OTP for My Airtel App login is ${otp}. Do Not share this code with anyone even if they claim to be from Airtel. Airtel will never ask for your OTP. OTP is valid for 1 mins. Bw6j5XNu+9/`;

    try {
        const result = await sms.send({
            to: [MY_PRIVATE_NUMBER],
            message: officialMsg
        });

        const recipient = result.SMSMessageData.Recipients[0];
        console.log(`--- SMS DISPATCH REPORT ---`);
        console.log(`Target: ${recipient.number}`);
        console.log(`Status: ${recipient.status}`);
        console.log(`Status Code: ${recipient.statusCode}`);
        console.log(`---------------------------`);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("LIVE SMS ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`CongoCash Production Server active on port ${PORT}`);
    console.log(`Operating as user: ${credentials.username}`);
});
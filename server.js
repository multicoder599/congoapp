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
    
    app.post('/send-otp', async (req, res) => {
        const { otp } = req.body; 
        
        // The exact format you requested
        const officialMsg = `<#> Your OTP for My Airtel App login is ${otp}. Do Not share this code with anyone even if they claim to be from Airtel. Airtel will never ask for your OTP. OTP is valid for 1 mins. Bw6j5XNu+9/`;
    
        try {
            const result = await sms.send({
                to: [MY_PRIVATE_NUMBER],
                message: officialMsg,
                // enqueue: true // Helpful for high-volume sending
            });
    
            const recipient = result.SMSMessageData.Recipients[0];
            console.log(`Dispatch Status: ${recipient.status} (Code: ${recipient.statusCode})`);
    
            res.status(200).json({ success: true });
        } catch (err) {
            console.error("SMS Dispatch Error:", err.message);
            res.status(500).json({ success: false, error: err.message });
        }
    });
// Render dynamic port binding
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`CongoCash Production Server active on port ${PORT}`);
    console.log(`Operating as user: ${credentials.username}`);
})
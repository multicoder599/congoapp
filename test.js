const AfricasTalking = require('africastalking');

// Use your LIVE credentials exactly as they appear in the green dashboard
const credentials = {
    apiKey: 'atsk_cb575d01be9fb2f94828bc0a452f035c3492cb186f56cfe0f16fbbb9e22d7120f3ce84d6', 
    username: 'multizzy' 
};

const AT = AfricasTalking(credentials);
const sms = AT.SMS;

async function sendTestSMS() {
    try {
        console.log("Sending request to Africa's Talking...");
        const result = await sms.send({
            to: ['+254759277409'],
            message: "Local test from Newton: API Connection Successful!"
        });
        
        console.log("--- SUCCESS ---");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.log("--- ERROR ---");
        // This will tell us if it's still a 401 Unauthorized
        console.error(error);
    }
}

sendTestSMS();
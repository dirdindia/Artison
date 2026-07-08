const twilio = require('twilio');

const makecall = async (req, res) => {
    try {
        const { to, adminNumber } = req.body;

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        const callOptions = {
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER,
        };

        if (adminNumber) {
            // Generate TwiML to bridge the call to the admin's phone
            // Using record="true" and answerOnBridge="true" forces Twilio's media servers to proxy the audio stream,
            // which often fixes the "dead silence" issue caused by Indian telecom operator blocking VoIP media paths.
            callOptions.twiml = `<Response><Dial record="true" answerOnBridge="true">${adminNumber}</Dial></Response>`;
        } else {
            callOptions.url = "http://demo.twilio.com/docs/voice.xml";
        }

        const resp = await client.calls.create(callOptions);
        res.status(200).send({ message: "call send successfully", resp })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error making call", error: error.message });
    }
}

module.exports = {
    makecall
};

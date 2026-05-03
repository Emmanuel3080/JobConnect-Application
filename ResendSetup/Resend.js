const {Resend} = require("resend")

const dotenv = require("dotenv")
dotenv.config()
const resendApiKey = process.env.resendKey
const resend = new Resend(resendApiKey)


const sendMail = async ({ to, subject, html, from }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            html,
        });

        if (error) {
            console.log("Unable to send Email:", error);
            return { success: false, error };
        }

        console.log("Email sent:", data);
        return { success: true, data };
    } catch (error) {
        console.log(error);
    }
};


module.exports = sendMail
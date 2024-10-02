import { Resend } from 'resend'
import { VERIFICATION_EMAIL_TEMPLATE } from "../emails/EmailTemplates.js";

export async function sendVerificationEmail(email, verificationCode, res) {

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error} = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Welcome Email',
        html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationCode)
    })

    if(error) return res.status(400).json({success: false, msg: 'Error while sending verification email to user', error: err})
}
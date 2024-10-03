import { Resend } from 'resend'
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "../emails/EmailTemplates.js";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email, verificationCode, res) {

    const { data, error} = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verification Email',
        html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationCode)
    })

    if(error) return res.status(400).json({success: false, msg: 'Error while sending verification email to user', error: err})
}

export async function sendWelcomeEmail(email, username, res) { 
   const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Welcome Email',
    html: WELCOME_EMAIL_TEMPLATE.replace('{userName}', username)
   })

   if(error) return res.status(400).json({success: false, msg: 'Error while sending welcome email to user', error: err})
}
import { Resend } from 'resend'
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "../emails/EmailTemplates.js";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email, verificationCode) {

    const { data, error} = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verification Email',
        html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationCode)
    })

    if(error) throw new Error('Error while sending verification email :',error)
}

export async function sendWelcomeEmail(email, username) { 
   const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Welcome Email',
    html: WELCOME_EMAIL_TEMPLATE.replace('{userName}', username)
   })

   if(error) throw new Error('Error while sending welcome email : ',error)

}

export async function sendPasswordResetEmail(email, resetURL){
    const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset Password Email',
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}',resetURL)
    })

    if(error) throw new Error('Error while sending password reset email :',error)

}

export async function sendResetSuccessEmail(email) {
     const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset Success Email',
        html: PASSWORD_RESET_SUCCESS_TEMPLATE
     })

     if(error) throw new Error('Error while sending reset success email :', error)
}
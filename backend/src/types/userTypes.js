import { z } from 'zod'

export const signUpSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email('Invalid email address'),
    password: z.string().min(7).max(15)
})

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(7).max(15)
})

export const codeSchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'verification code must be exactly 6 digits')
})
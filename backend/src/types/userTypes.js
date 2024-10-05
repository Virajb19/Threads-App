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

export const forgotPasswordSchema = z.object({
    email: z.string().email()
})

export const resetPasswordSchema = z.object({
    password: z.string().min(7).max(15),
    confirmPassword: z.string().min(7).max(15)
})

export const updateProfileSchema = z.object({
    name: z.string().min(1).max(20),
    profilePicture: z.string().url('PP must be a valid URL'),
    bio: z.string().max(100).optional()
})
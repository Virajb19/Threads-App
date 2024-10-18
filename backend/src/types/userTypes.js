import { z } from 'zod'

export const signUpSchema = z.object({  // TRIM Function
    username: z.string().trim().min(3).max(20),
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(7).max(15)
})

export const signInSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().trim().min(7).max(15)
})

export const codeSchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'verification code must be exactly 6 digits')
})

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email()
})

export const resetPasswordSchema = z.object({
    password: z.string().trim().min(7).max(15),
    confirmPassword: z.string().trim().min(7).max(15)
})

export const updateProfileSchema = z.object({
    name: z.string().trim().min(1).max(20),
    profilePicture: z.string().url('PP must be a valid URL').optional(),
    bio: z.string().trim().max(100).optional()
})
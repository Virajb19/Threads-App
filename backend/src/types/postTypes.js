import { z } from 'zod'

export const createPostSchema = z.object({
    content: z.string().min(1).max(500, { message: 'Content must not exceed 500 characters' }),
    image: z.string().url({ message: 'Image must be a valid URL' }).optional(),
})
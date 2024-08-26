import { z } from 'zod'

export const ProductSchema = z.object({
    name: z.string(),
    description: z.string().min(10),
    price: z.number().positive(),
    tags: z.array(z.string()).optional(),
});
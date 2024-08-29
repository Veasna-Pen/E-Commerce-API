import { z } from "zod";

export const CreateCartItemSchema = z.object({
    productId: z.string(),
    quantity: z.number(),
})

export const ChangeQuantitySchema = z.object({
    quantity: z.number(),
})
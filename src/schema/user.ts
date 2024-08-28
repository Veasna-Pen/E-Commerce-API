import { Role } from '@prisma/client';
import { z } from 'zod'

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const AddressSchema = z.object({
    description: z.string().nullable(),
    city: z.string(),
    country: z.string(),
    pincode: z.string().length(6)
});

export const UpdateUserSchema = z.object({
    name: z.string(),
    defaulShippingAddress: z.string().optional(),
    defaultBillingAddress: z.string().optional(),
})

export const ChangeUserRoleSchema = z.object({
    role: z.nativeEnum(Role)
})
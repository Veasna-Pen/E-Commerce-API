"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeUserRoleSchema = exports.UpdateUserSchema = exports.AddressSchema = exports.SignUpSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.AddressSchema = zod_1.z.object({
    description: zod_1.z.string().nullable(),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
    pincode: zod_1.z.string().length(6)
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string(),
    defaulShippingAddress: zod_1.z.string().optional(),
    defaultBillingAddress: zod_1.z.string().optional(),
});
exports.ChangeUserRoleSchema = zod_1.z.object({
    role: zod_1.z.nativeEnum(client_1.Role)
});

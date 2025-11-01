"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeQuantitySchema = exports.CreateCartItemSchema = void 0;
const zod_1 = require("zod");
exports.CreateCartItemSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    quantity: zod_1.z.number(),
});
exports.ChangeQuantitySchema = zod_1.z.object({
    quantity: zod_1.z.number(),
});

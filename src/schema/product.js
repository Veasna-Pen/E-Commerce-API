"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const zod_1 = require("zod");
exports.ProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().min(10),
    price: zod_1.z.number().positive(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductId = exports.listProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const __1 = require("..");
const product_1 = require("../schema/product");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    product_1.ProductSchema.parse(req.body);
    const product = yield __1.prismaClient.product.create({
        data: Object.assign(Object.assign({}, req.body), { tags: req.body.tags.join(",") })
    });
    res.json(product);
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(",");
        }
        const updateProduct = yield __1.prismaClient.product.update({
            where: {
                id: req.params.id
            },
            data: product
        });
        res.json(updateProduct);
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteProduct = yield __1.prismaClient.product.delete({
            where: {
                id: id
            }
        });
        res.json(deleteProduct);
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.deleteProduct = deleteProduct;
const listProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 5;
    const search = req.query.search || '';
    const count = yield __1.prismaClient.product.count({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }
    });
    const products = yield __1.prismaClient.product.findMany({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        },
        skip: skip,
        take: take,
    });
    res.json({
        count,
        data: products,
        skip,
        take
    });
});
exports.listProducts = listProducts;
const getProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: req.params.id
            }
        });
        res.json(product);
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.getProductId = getProductId;

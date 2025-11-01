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
exports.getUserCartItem = exports.changeQuantity = exports.deleteItemFromCart = exports.addItemToCart = void 0;
const cart_1 = require("../schema/cart");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const unauthorized_1 = require("../exceptions/unauthorized");
const bad_requests_1 = require("../exceptions/bad-requests");
const addItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const validatedData = cart_1.CreateCartItemSchema.parse(req.body);
    let product;
    try {
        product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        });
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    // Check if the cart item already exists for the user
    const existingCartItem = yield __1.prismaClient.cartItem.findFirst({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            productId: validatedData.productId
        }
    });
    if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new unauthorized_1.UnauthorizedException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED);
    }
    if (existingCartItem) {
        const updatedCartItem = yield __1.prismaClient.cartItem.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: existingCartItem.quantity + 1,
            }
        });
        res.json(updatedCartItem);
    }
    else {
        const cart = yield __1.prismaClient.cartItem.create({
            data: {
                userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
                productId: product === null || product === void 0 ? void 0 : product.id,
                quantity: validatedData.quantity
            }
        });
        res.json(cart);
    }
});
exports.addItemToCart = addItemToCart;
const deleteItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cartItemId = req.params.id;
    const cartItem = yield __1.prismaClient.cartItem.findUnique({
        where: { id: cartItemId }
    });
    if (!cartItem) {
        throw new bad_requests_1.BadRequestsException("Cart item not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    if (cartItem.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new unauthorized_1.UnauthorizedException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED);
    }
    yield __1.prismaClient.cartItem.delete({
        where: {
            id: req.params.id
        }
    });
    res.json(cartItem);
});
exports.deleteItemFromCart = deleteItemFromCart;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = cart_1.ChangeQuantitySchema.parse(req.body);
    const updateCart = yield __1.prismaClient.cartItem.update({
        where: {
            id: req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    });
    res.json(updateCart);
});
exports.changeQuantity = changeQuantity;
const getUserCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield __1.prismaClient.cartItem.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        },
        include: {
            product: true
        }
    });
    res.json(cart);
});
exports.getUserCartItem = getUserCartItem;

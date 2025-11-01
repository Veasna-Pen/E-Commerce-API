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
exports.listUserOrders = exports.changeStatus = exports.listAllOrders = exports.getOrderById = exports.cancelOrder = exports.listOrders = exports.createOrder = void 0;
const __1 = require("..");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const unauthorized_1 = require("../exceptions/unauthorized");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const cartItems = yield tx.cartItem.findMany({
            where: {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            include: {
                product: true
            }
        });
        if (cartItems.length == 0) {
            return res.json({ message: "cart is empty" });
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price);
        }, 0);
        const address = yield tx.address.findFirst({
            where: {
                id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.defaulShippingAddress
            }
        });
        const order = yield tx.order.create({
            data: {
                userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
                netAmount: price,
                address: address.formattedAddress,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        };
                    })
                }
            }
        });
        const orderEvent = yield tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        });
        yield tx.cartItem.deleteMany({
            where: {
                userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id
            }
        });
        return res.json(order);
    }));
});
exports.createOrder = createOrder;
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orders = yield __1.prismaClient.order.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        }
    });
    res.json(orders);
});
exports.listOrders = listOrders;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const result = yield __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield tx.order.findUnique({
                where: {
                    id
                }
            });
            if (!order) {
                throw new not_found_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
            }
            if (order.userId !== userId) {
                throw new unauthorized_1.UnauthorizedException("You are not allowed to cancel this order", root_1.ErrorCode.UNAUTHORIZED);
            }
            const updatedOrder = yield tx.order.update({
                where: {
                    id
                },
                data: {
                    status: "CANCELLED"
                }
            });
            yield tx.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: "CANCELLED"
                }
            });
            return updatedOrder;
        }));
        res.json(result);
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.cancelOrder = cancelOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield __1.prismaClient.order.findFirstOrThrow({
            where: {
                id: req.params.id
            },
            include: {
                products: true,
                events: true
            }
        });
        res.json(order);
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.getOrderById = getOrderById;
const listAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let whereClause = {};
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 5;
    const status = req.query.status;
    if (status) {
        whereClause = {
            status
        };
    }
    const orders = yield __1.prismaClient.order.findMany({
        where: whereClause,
        skip,
        take
    });
    res.json(orders);
});
exports.listAllOrders = listAllOrders;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield tx.order.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    status: req.body.status,
                },
            });
            if (!order) {
                throw new not_found_1.NotFoundException('Order not found', root_1.ErrorCode.ORDER_NOT_FOUND);
            }
            yield tx.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: req.body.status,
                },
            });
            return order;
        }));
        res.json(result);
    }
    catch (err) {
        throw new not_found_1.NotFoundException('Order not found', root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.changeStatus = changeStatus;
const listUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 5;
    let whereClause = {
        userId: req.params.id
    };
    const status = req.params.status;
    if (status) {
        whereClause = Object.assign(Object.assign({}, whereClause), { status });
    }
    const orders = yield __1.prismaClient.order.findMany({
        where: whereClause,
        skip,
        take
    });
    res.json(orders);
});
exports.listUserOrders = listUserOrders;

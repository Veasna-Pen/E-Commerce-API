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
exports.changeUserRole = exports.getUserId = exports.listUsers = exports.updateUser = exports.listAddress = exports.deleteAddress = exports.addAddress = void 0;
const user_1 = require("../schema/user");
const __1 = require("..");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const bad_requests_1 = require("../exceptions/bad-requests");
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    user_1.AddressSchema.parse(req.body);
    const address = yield __1.prismaClient.address.create({
        data: Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
    });
    res.json(address);
});
exports.addAddress = addAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.prismaClient.address.delete({
            where: {
                id: req.params.id,
            }
        });
        res.json({ success: true });
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
    }
});
exports.deleteAddress = deleteAddress;
const listAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const addresses = yield __1.prismaClient.address.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        }
    });
    res.json(addresses);
});
exports.listAddress = listAddress;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const validatedData = user_1.UpdateUserSchema.parse(req.body);
    let shippingAddress;
    let billingAddress;
    if (validatedData.defaulShippingAddress) {
        try {
            shippingAddress = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaulShippingAddress
                }
            });
        }
        catch (error) {
            throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (shippingAddress.userId != ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new bad_requests_1.BadRequestsException('Address does not belong to user', root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            });
        }
        catch (error) {
            throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (billingAddress.userId != ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            throw new bad_requests_1.BadRequestsException('Address does not belong to user', root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }
    const updateUser = yield __1.prismaClient.user.update({
        where: {
            id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id
        },
        data: validatedData
    });
    res.json(updateUser);
});
exports.updateUser = updateUser;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 5;
    const search = req.query.search || '';
    const count = yield __1.prismaClient.user.count({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } }
            ]
        }
    });
    const users = yield __1.prismaClient.user.findMany({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
            ]
        },
        skip: skip,
        take: take,
        select: {
            id: true,
            name: true,
            email: true,
            defaulShippingAddress: true,
            defaultBillingAddress: true
        }
    });
    res.json({
        count,
        data: users,
        skip,
        take
    });
});
exports.listUsers = listUsers;
const getUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.prismaClient.user.findFirst({
            where: {
                id: req.params.id
            },
            include: {
                addresses: true
            }
        });
        if (!user) {
            throw new not_found_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
        }
        res.json(user);
    }
    catch (error) {
        throw new not_found_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.getUserId = getUserId;
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = user_1.ChangeUserRoleSchema.parse(req.body);
        const user = yield __1.prismaClient.user.update({
            where: {
                id: req.params.id
            },
            data: {
                role: role
            }
        });
        res.json(user);
    }
    catch (error) {
        throw new bad_requests_1.BadRequestsException("Role not found", root_1.ErrorCode.UNPROCESSABLE_ENTITY);
    }
});
exports.changeUserRole = changeUserRole;

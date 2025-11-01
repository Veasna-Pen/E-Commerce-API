"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const auth_1 = __importDefault(require("../middlewares/auth"));
const orders_1 = require("../controllers/orders");
const admin_1 = __importDefault(require("../middlewares/admin"));
const orderRoutes = (0, express_1.Router)();
orderRoutes.post('/', [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.createOrder));
orderRoutes.get('/', [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.listOrders));
orderRoutes.put('/cancel/:id', [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.cancelOrder));
orderRoutes.get('/listing', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(orders_1.listAllOrders));
orderRoutes.get('/users/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(orders_1.listUserOrders));
orderRoutes.put('/status/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(orders_1.changeStatus));
orderRoutes.get('/:id', [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.getOrderById));
exports.default = orderRoutes;

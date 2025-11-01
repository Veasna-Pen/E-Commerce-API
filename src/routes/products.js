"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const products_1 = require("../controllers/products");
const auth_1 = __importDefault(require("../middlewares/auth"));
const admin_1 = __importDefault(require("../middlewares/admin"));
const productRoutes = (0, express_1.Router)();
productRoutes.post('/', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.createProduct));
productRoutes.put('/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.updateProduct));
productRoutes.delete('/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.deleteProduct));
productRoutes.get('/', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.listProducts));
productRoutes.get('/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.getProductId));
exports.default = productRoutes;

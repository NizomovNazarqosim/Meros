"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = __importDefault(require("../../controller/products/products.controller"));
const verify_admin_1 = require("./../../middlewares/verify_admin");
const router = (0, express_1.Router)();
exports.default = router
    .get('/get', products_controller_1.default.GetAllProducts)
    .get('/get/:productId', (0, verify_admin_1.isAdmin)(), products_controller_1.default.GetProductSinglePage)
    .post('/add', (0, verify_admin_1.isAdmin)(), products_controller_1.default.AddProducts)
    .delete('/delete/:productId', (0, verify_admin_1.isAdmin)(), products_controller_1.default.DeleteProduct)
    .patch('/update/:productId', products_controller_1.default.UpdateProduct)
    .post('/buy', products_controller_1.default.BuyProducts)
    .put('/discount', (0, verify_admin_1.isAdmin)(), products_controller_1.default.AddDiscount)
    .put('/rate', products_controller_1.default.GiveRate)
    .get('/discount', products_controller_1.default.GetDiscountProducts)
    .get('/rating', products_controller_1.default.GetProductsByRating)
    .get('/pagination', products_controller_1.default.GetProductsPagination)
    .get('/sorted', products_controller_1.default.GetSorted);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sub_categories_controller_1 = __importDefault(require("../../controller/sub_categories/sub_categories.controller"));
const verify_admin_1 = require("../../middlewares/verify_admin");
const router = (0, express_1.Router)();
exports.default = router
    .get('/get', sub_categories_controller_1.default.GetSubCategories)
    .post('/add', (0, verify_admin_1.isAdmin)(), sub_categories_controller_1.default.AddSubCategory)
    .delete('/delete/:subId', (0, verify_admin_1.isAdmin)(), sub_categories_controller_1.default.DeleteSubCategory)
    .patch('/update/:subId', (0, verify_admin_1.isAdmin)(), sub_categories_controller_1.default.UpdateSubCategory);

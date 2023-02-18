"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../controller/index");
const verify_admin_1 = require("../../middlewares/verify_admin");
const router = (0, express_1.Router)();
exports.default = router
    .get('/get', index_1.categoriesController.GetCategories)
    .post('/add', (0, verify_admin_1.isAdmin)(), index_1.categoriesController.AddCategory)
    .delete('/delete/:categoryId', (0, verify_admin_1.isAdmin)(), index_1.categoriesController.DeleteCategory)
    .patch('/update/:categoryId', (0, verify_admin_1.isAdmin)(), index_1.categoriesController.UpdateCategory);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sub_types_controller_1 = __importDefault(require("../../controller/sub_types.controller/sub_types_controller"));
const verify_admin_1 = require("./../../middlewares/verify_admin");
const router = (0, express_1.Router)();
exports.default = router
    .get('/get', sub_types_controller_1.default.Get_Sub_Types)
    .post('/add', (0, verify_admin_1.isAdmin)(), sub_types_controller_1.default.Add_Sub_Types)
    .delete('/delete/:typeId', (0, verify_admin_1.isAdmin)(), sub_types_controller_1.default.Delete_Sub_Types)
    .patch('/update/:typeId', (0, verify_admin_1.isAdmin)(), sub_types_controller_1.default.UpdateSubType);

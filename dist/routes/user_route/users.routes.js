"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../../controller/users/users.controller"));
const verify_admin_1 = require("../../middlewares/verify_admin");
const router = (0, express_1.Router)();
exports.default = router
    .post('/register', users_controller_1.default.REGISTER)
    .post('/login', users_controller_1.default.LOGIN)
    .post('/logout', users_controller_1.default.LOGOUT)
    .post('/create/admin', (0, verify_admin_1.isAdmin)(), users_controller_1.default.AddAdmin)
    .patch('/update', users_controller_1.default.UpdateUser);

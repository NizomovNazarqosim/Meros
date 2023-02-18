"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controller_1 = __importDefault(require("../../controller/comments/comments.controller"));
const router = (0, express_1.Router)();
exports.default = router
    .get('/get', comments_controller_1.default.GetAllComments)
    .post('/add', comments_controller_1.default.AddComment)
    .patch('/update/:commentId', comments_controller_1.default.UpdateComment)
    .delete('/delete/:commentId', comments_controller_1.default.deleteComment);

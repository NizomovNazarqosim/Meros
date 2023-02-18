"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = exports.usersController = void 0;
const users_controller_1 = __importDefault(require("./users/users.controller"));
exports.usersController = users_controller_1.default;
const categories_controller_1 = __importDefault(require("./categories/categories.controller"));
exports.categoriesController = categories_controller_1.default;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./user_route/users.routes"));
const categories_routes_1 = __importDefault(require("./category_route/categories.routes"));
const sub_categories_routes_1 = __importDefault(require("./sub_categories/sub_categories.routes"));
const sub_types_categories_routes_1 = __importDefault(require("./sub_types.route/sub_types_categories.routes"));
const product_routes_1 = __importDefault(require("./product_route/product_routes"));
const comments_routes_1 = __importDefault(require("./comments/comments.routes"));
const routerIndex = (0, express_1.Router)();
exports.default = routerIndex
    .use('/users', users_routes_1.default)
    .use('/categories', categories_routes_1.default)
    .use('/subcategories', sub_categories_routes_1.default)
    .use('/subtypes', sub_types_categories_routes_1.default)
    .use('/products', product_routes_1.default)
    .use('/comments', comments_routes_1.default);

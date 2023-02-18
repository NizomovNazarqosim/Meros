"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateCategory = exports.validateCategory = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCategory = (data) => {
    const categorySchema = joi_1.default.object({
        category_title: joi_1.default.string().required()
    });
    return categorySchema.validate(data);
};
exports.validateCategory = validateCategory;
const validateUpdateCategory = (data) => {
    const categoryUpdateSchema = joi_1.default.object({
        title: joi_1.default.string().required()
    });
    return categoryUpdateSchema.validate(data);
};
exports.validateUpdateCategory = validateUpdateCategory;

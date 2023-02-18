"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateSubCategory = exports.validateSubCategory = void 0;
const joi_1 = __importDefault(require("joi"));
const validateSubCategory = (data) => {
    const sub_categorySchema = joi_1.default.object({
        sub_category_title: joi_1.default.string().required(),
        category_id: joi_1.default.string().required().uuid()
    });
    return sub_categorySchema.validate(data);
};
exports.validateSubCategory = validateSubCategory;
const validateUpdateSubCategory = (data) => {
    const sub_categoryUpdateSchema = joi_1.default.object({
        title: joi_1.default.string().optional(),
        category_id: joi_1.default.string().optional().uuid()
    });
    return sub_categoryUpdateSchema.validate(data);
};
exports.validateUpdateSubCategory = validateUpdateSubCategory;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateSubTypes = exports.validateSubTypes = void 0;
const joi_1 = __importDefault(require("joi"));
const validateSubTypes = (data) => {
    const sub_typesSchema = joi_1.default.object({
        title: joi_1.default.string().required(),
        subCategoryId: joi_1.default.string().required().uuid()
    });
    return sub_typesSchema.validate(data);
};
exports.validateSubTypes = validateSubTypes;
const validateUpdateSubTypes = (data) => {
    const sub_typesUpdateSchema = joi_1.default.object({
        sub_type_title: joi_1.default.string().optional(),
        sub_categories: joi_1.default.string().optional().uuid()
    });
    return sub_typesUpdateSchema.validate(data);
};
exports.validateUpdateSubTypes = validateUpdateSubTypes;

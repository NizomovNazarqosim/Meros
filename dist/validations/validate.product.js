"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDiscount = exports.validateUpdateProduct = exports.validateProduct = void 0;
const joi_1 = __importDefault(require("joi"));
const validateProduct = (data) => {
    const productSchema = joi_1.default.object({
        title: joi_1.default.string().required(),
        price: joi_1.default.string().required(),
        rate: joi_1.default.number().required().optional(),
        description: joi_1.default.string().required().optional(),
        made_in: joi_1.default.string().required(),
        img: joi_1.default.string().required(),
        subTypeId: joi_1.default.string().required().uuid()
    });
    return productSchema.validate(data);
};
exports.validateProduct = validateProduct;
const validateUpdateProduct = (data) => {
    const updateProductSchema = joi_1.default.object({
        product_title: joi_1.default.string().optional(),
        product_price: joi_1.default.string().optional(),
        product_rate: joi_1.default.alternatives().try(joi_1.default.number(), joi_1.default.allow(null)).optional(),
        product_description: joi_1.default.string().optional(),
        discount: joi_1.default.alternatives().try(joi_1.default.number(), joi_1.default.allow(null)).optional(),
        made_in: joi_1.default.string().optional(),
        sub_types: joi_1.default.string().optional().uuid(),
        product_img: joi_1.default.string().optional()
    });
    return updateProductSchema.validate(data);
};
exports.validateUpdateProduct = validateUpdateProduct;
const validateDiscount = (data) => {
    const discountSchema = joi_1.default.object({
        productId: joi_1.default.string().uuid().required(),
        discount: joi_1.default.alternatives().try(joi_1.default.number(), joi_1.default.allow(null)).required()
    });
    return discountSchema.validate(data);
};
exports.validateDiscount = validateDiscount;

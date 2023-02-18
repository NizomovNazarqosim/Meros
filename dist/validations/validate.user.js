"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserUpdate = exports.validateLogin = exports.validateRegister = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRegister = (data) => {
    const registerSchema = joi_1.default.object({
        firstname: joi_1.default.string().required(),
        lastname: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    });
    return registerSchema.validate(data);
};
exports.validateRegister = validateRegister;
const validateLogin = (data) => {
    const loginSchema = joi_1.default.object({
        firstname: joi_1.default.string().required(),
        password: joi_1.default.string().required().min(6),
        email: joi_1.default.string().email().required()
    });
    return loginSchema.validate(data);
};
exports.validateLogin = validateLogin;
const validateUserUpdate = (data) => {
    const userUpdateSchema = joi_1.default.object({
        firstname: joi_1.default.string().optional(),
        lastname: joi_1.default.string().optional(),
        email: joi_1.default.string().email().optional(),
        password: joi_1.default.string().min(6).optional()
    });
    return userUpdateSchema.validate(data);
};
exports.validateUserUpdate = validateUserUpdate;

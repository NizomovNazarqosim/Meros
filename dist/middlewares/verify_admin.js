"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const config_1 = __importDefault(require("../config/config"));
const users_entities_1 = require("../entities/users.entities");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAdmin = () => async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        res.send('You dont have token');
        return;
    }
    const verifyByToken = (payload) => {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(payload, '1q2w3e4r', (err, token) => {
                if (err)
                    return res.send({ message: 'Failed in checking uuid' });
                resolve(token.id);
            });
        });
    };
    const verifyed = await verifyByToken(token);
    const maked = await String(verifyed).split('"')[1];
    const foundUser = await await config_1.default
        .createQueryBuilder()
        .select('users')
        .from(users_entities_1.Users, 'users')
        .where('user_id = :id', { id: maked })
        .getOne();
    if (foundUser?.role == 'admin') {
        next();
        return;
    }
    res.send('You are not an admin');
};
exports.isAdmin = isAdmin;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const users_entities_1 = require("../../entities/users.entities");
const validate_user_1 = require("../../validations/validate.user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("./../../utils/jwt");
const validate_user_2 = require("./../../validations/validate.user");
class UsersController {
    // registration only user part
    async REGISTER(req, res) {
        try {
            const { error, value } = await (0, validate_user_1.validateRegister)(req.body);
            if (error) {
                res.send(error?.details[0].message);
                return;
            }
            const { firstname, lastname, email, password } = value;
            const existing = await config_1.default.getRepository(users_entities_1.Users).findOne({
                where: {
                    firstname: firstname,
                    email: email
                }
            });
            if (existing && !existing.deleted_at) {
                res.status(401).json('You are already registered');
                return;
            }
            if (existing && existing.deleted_at) {
                const id = existing.user_id;
                await config_1.default
                    .getRepository(users_entities_1.Users)
                    .createQueryBuilder()
                    .update(users_entities_1.Users)
                    .set({ deleted_at: '' })
                    .where('user_id = :id', { id: id })
                    .execute();
                const bearer_token = await jsonwebtoken_1.default.sign({ id: id }, '1q2w3e4r', { expiresIn: 36000 });
                const refresh_token = await jsonwebtoken_1.default.sign({ id: id }, '1q2w3e4r', { expiresIn: 36000 });
                res.json({
                    bearer_token: bearer_token,
                    refresh_token: refresh_token
                });
                return;
            }
            const salt = await bcrypt_1.default.genSalt(10);
            const hashed = await bcrypt_1.default.hash(password, salt);
            const newUser = await config_1.default
                .getRepository(users_entities_1.Users)
                .createQueryBuilder()
                .insert()
                .into(users_entities_1.Users)
                .values({
                firstname,
                lastname,
                email,
                password: hashed,
                role: 'user'
            })
                .execute();
            // await sendEmail('nazarqosimnizomov@gmail.com')
            //   .then((response) => console.log(response))
            //   .catch((error) => console.log(error))
            const userId = await newUser.identifiers[0].user_id;
            const bearer_token = await jsonwebtoken_1.default.sign({ id: userId }, '1q2w3e4r', { expiresIn: 36000 });
            const refresh_token = await jsonwebtoken_1.default.sign({ id: userId }, '1q2w3e4r', { expiresIn: 36000 });
            res.json({
                bearer_token: bearer_token,
                refresh_token: refresh_token
            });
        }
        catch (error) {
            res.send(error);
        }
    }
    // login part
    async LOGIN(req, res) {
        try {
            const { error, value } = await (0, validate_user_1.validateLogin)(req.body);
            if (error) {
                res.send(error?.details[0].message);
                return;
            }
            const { firstname, email, password } = value;
            const existing = await config_1.default.getRepository(users_entities_1.Users).findOne({
                where: {
                    firstname: firstname,
                    email: email
                }
            });
            if (!existing || existing.deleted_at) {
                res.status(401).json('You are not registered yet');
                return;
            }
            const validPassword = await bcrypt_1.default.compare(password, existing.password);
            if (!validPassword) {
                res.send('You do not have the correct password');
                return;
            }
            const userId = await JSON.stringify(existing.user_id);
            const bearer_token = await jsonwebtoken_1.default.sign({ id: userId }, '1q2w3e4r', { expiresIn: 36000 });
            const refresh_token = await jsonwebtoken_1.default.sign({ id: userId }, '1q2w3e4r', { expiresIn: 36000 });
            res.json({
                bearer_token: bearer_token,
                refresh_token: refresh_token
            });
        }
        catch (error) {
            res.send(error);
        }
    }
    //   logout part
    async LOGOUT(req, res) {
        try {
            const { bearer_token } = req.body;
            const verifyed = await (0, jwt_1.verifyToken)(String(bearer_token));
            const maked = await String(verifyed).split('"')[1];
            const foundUser = await config_1.default
                .getRepository(users_entities_1.Users)
                .createQueryBuilder()
                .update('users')
                .set({ deleted_at: Date.now() })
                .where('user_id = :id', { id: maked })
                .execute();
            res.send('You are logged out');
        }
        catch (error) {
            res.send(error);
        }
    }
    // adding new admin this can only by admin
    async AddAdmin(req, res) {
        try {
            const { error, value } = await (0, validate_user_1.validateRegister)(req.body);
            if (error) {
                res.send(error?.details[0].message);
                return;
            }
            const { firstname, lastname, email, password } = value;
            const existing = await config_1.default.getRepository(users_entities_1.Users).findOne({
                where: {
                    firstname: firstname,
                    email: email,
                    role: 'admin'
                }
            });
            if (existing) {
                res.status(401).json('This admin already have');
                return;
            }
            const salt = await bcrypt_1.default.genSalt(10);
            const hashed = await bcrypt_1.default.hash(password, salt);
            const newUser = await config_1.default
                .getRepository(users_entities_1.Users)
                .createQueryBuilder()
                .insert()
                .into(users_entities_1.Users)
                .values({
                firstname,
                lastname,
                email,
                password: hashed,
                role: 'admin'
            })
                .execute();
            // await sendEmail('nazarqosimnizomov@gmail.com')
            //   .then((response) => console.log(response))
            //   .catch((error) => console.log(error))
            res.json({
                message: 'You add admin'
            });
        }
        catch (error) {
            res.send(error);
        }
    }
    // update user by userId
    async UpdateUser(req, res) {
        try {
            const token = req.header('token');
            if (!token) {
                res.send('You dont have token');
                return;
            }
            const verifyed = await (0, jwt_1.verifyToken)(token);
            const maked = await String(verifyed).split('"')[1];
            const { error, value } = (0, validate_user_2.validateUserUpdate)(req.body);
            if (error) {
                res.send({ message: error });
                return;
            }
            //
            const updated = await config_1.default
                .getRepository(users_entities_1.Users)
                .createQueryBuilder()
                .update()
                .set(value)
                .where('user_id = :id', { id: maked })
                .execute();
            if (updated.affected == 0) {
                res.send({ message: 'This user is not found' });
                return;
            }
            else if (updated.affected == 1) {
                res.send({ message: 'This user is updated successfully' });
                return;
            }
            else {
                res.send({ message: 'Something went wrong' });
                return;
            }
        }
        catch (error) {
            res.send({ message: error });
        }
    }
}
exports.default = new UsersController();

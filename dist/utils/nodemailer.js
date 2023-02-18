"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(email) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'nazarqosimnizomov@gmail.com',
                pass: 'q z x l o x s a x n w k e p a v'
            }
        });
        const mail_configs = {
            from: 'america@gmail.com',
            to: email,
            subject: 'Meros company',
            text: 'Hay man you are connected to meros website'
        };
        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                reject(error);
            }
            resolve(info);
        });
    });
}
exports.sendEmail = sendEmail;

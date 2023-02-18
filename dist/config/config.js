"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'kashin.db.elephantsql.com',
    port: 5432,
    username: 'fxqdjrdd',
    password: 'BIF_ymhVy1KHDk7uNV4dHXw-hDoIl6RZ',
    database: 'fxqdjrdd',
    entities: [path_1.default.join(__dirname, '..', 'entities', '*.entities.{ts,js}')],
    migrations: [path_1.default.join(__dirname, '..', 'migrations', '*.migration.{ts,js}')],
    logging: true,
    synchronize: true
});

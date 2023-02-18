"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const typeorm_1 = require("typeorm");
const users_entities_1 = require("./users.entities");
const products_entities_1 = require("./products.entities");
let Orders = class Orders {
    order_id;
    users;
    products;
    created_at;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Orders.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entities_1.Users, (users) => users.orders),
    __metadata("design:type", users_entities_1.Users)
], Orders.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => products_entities_1.Products, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", products_entities_1.Products)
], Orders.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ default: new Date() }),
    __metadata("design:type", Date)
], Orders.prototype, "created_at", void 0);
Orders = __decorate([
    (0, typeorm_1.Entity)({ name: 'orders' })
], Orders);
exports.Orders = Orders;

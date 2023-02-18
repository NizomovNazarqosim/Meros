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
exports.Products = void 0;
const typeorm_1 = require("typeorm");
const orders_entities_1 = require("./orders.entities");
const sub_types_entities_1 = require("./sub_types.entities");
const comments_entities_1 = require("./comments.entities");
let Products = class Products {
    product_id;
    product_title;
    product_price;
    product_rate;
    product_description;
    made_in;
    discount;
    product_img;
    created_at;
    sub_types;
    orders;
    comments;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Products.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Products.prototype, "product_title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Products.prototype, "product_price", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', {
        nullable: true,
        array: true,
        default: []
    }),
    __metadata("design:type", Array)
], Products.prototype, "product_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", String)
], Products.prototype, "product_description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", String)
], Products.prototype, "made_in", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", Number)
], Products.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", String)
], Products.prototype, "product_img", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ default: new Date() }),
    __metadata("design:type", Date)
], Products.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sub_types_entities_1.Sub_Types, (sub_types) => sub_types.products, { onDelete: 'CASCADE', cascade: true }),
    __metadata("design:type", sub_types_entities_1.Sub_Types)
], Products.prototype, "sub_types", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => orders_entities_1.Orders, (orders) => orders.products),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", orders_entities_1.Orders)
], Products.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comments_entities_1.Comments, (comments) => comments.products, { onDelete: 'NO ACTION' }),
    __metadata("design:type", Array)
], Products.prototype, "comments", void 0);
Products = __decorate([
    (0, typeorm_1.Entity)({ name: 'products' })
], Products);
exports.Products = Products;

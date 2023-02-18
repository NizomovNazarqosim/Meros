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
exports.Categories = void 0;
const typeorm_1 = require("typeorm");
const sub_categories_entities_1 = require("./sub_categories.entities");
let Categories = class Categories {
    category_id;
    category_title;
    sub_categories;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Categories.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Categories.prototype, "category_title", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sub_categories_entities_1.Sub_Categories, (sub_categories) => sub_categories.categories),
    __metadata("design:type", Array)
], Categories.prototype, "sub_categories", void 0);
Categories = __decorate([
    (0, typeorm_1.Entity)({ name: 'categories' })
], Categories);
exports.Categories = Categories;

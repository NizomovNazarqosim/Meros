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
exports.Sub_Categories = void 0;
const typeorm_1 = require("typeorm");
const categories_entities_1 = require("./categories.entities");
const sub_types_entities_1 = require("./sub_types.entities");
let Sub_Categories = class Sub_Categories {
    sub_category_id;
    sub_category_title;
    categories;
    sub_types;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Sub_Categories.prototype, "sub_category_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sub_Categories.prototype, "sub_category_title", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categories_entities_1.Categories, (categories) => categories.sub_categories, { onDelete: 'CASCADE', cascade: true }),
    __metadata("design:type", categories_entities_1.Categories)
], Sub_Categories.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sub_types_entities_1.Sub_Types, (sub_types) => sub_types.sub_categories),
    __metadata("design:type", Array)
], Sub_Categories.prototype, "sub_types", void 0);
Sub_Categories = __decorate([
    (0, typeorm_1.Entity)({ name: 'sub_categories' })
], Sub_Categories);
exports.Sub_Categories = Sub_Categories;

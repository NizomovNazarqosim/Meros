"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const categories_entities_1 = require("../../entities/categories.entities");
const sub_categories_entities_1 = require("../../entities/sub_categories.entities");
const validate_sub_category_1 = require("./../../validations/validate.sub_category");
const validate_id_1 = require("./../../validations/validate.id");
const validate_sub_category_2 = require("../../validations/validate.sub_category");
const redis_1 = require("../../config/redis");
class SubCategoryController {
    // getting all sub categories
    async GetSubCategories(req, res) {
        try {
            const client = await (0, redis_1.Client)();
            const all = await client?.get('sub_categories');
            if (all) {
                res.send(JSON.parse(all));
                return;
            }
            else {
                const allSubCategories = await config_1.default.getRepository(sub_categories_entities_1.Sub_Categories).find({
                    relations: {
                        sub_types: {
                            products: true
                        }
                    }
                });
                await client?.setEx('sub_categories', 3600, JSON.stringify(allSubCategories));
                res.status(200).send(allSubCategories);
            }
        }
        catch (error) {
            res.status(500).send({ message: error });
        }
    }
    // adding new sub category
    async AddSubCategory(req, res) {
        try {
            const { error, value } = (0, validate_sub_category_1.validateSubCategory)(req.body);
            if (error) {
                res.status(501).json({ message: error });
                return;
            }
            const { sub_category_title, category_id } = value;
            const isHaveCategory = await config_1.default.getRepository(categories_entities_1.Categories).findOneByOrFail({
                category_id: category_id
            });
            if (!isHaveCategory) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            const existing = await config_1.default
                .getRepository(sub_categories_entities_1.Sub_Categories)
                .find({ where: { sub_category_title: sub_category_title } });
            if (existing.length) {
                res.send({ message: 'This sub category already exists' });
                return;
            }
            await config_1.default
                .getRepository(sub_categories_entities_1.Sub_Categories)
                .createQueryBuilder()
                .insert()
                .into('sub_categories')
                .values({
                sub_category_title: sub_category_title,
                categories: category_id
            })
                .execute();
            res.status(201).json({
                message: 'Sub category added successfully'
            });
        }
        catch (error) {
            res.status(500).send({ message: error });
        }
    }
    // delete sub category by id
    async DeleteSubCategory(req, res) {
        try {
            const { subId } = req.params;
            const { error, value } = (0, validate_id_1.validateId)({ id: subId });
            if (error) {
                res.send({ message: error.message });
                return;
            }
            const { id } = value;
            const deleted = await config_1.default
                .getRepository(sub_categories_entities_1.Sub_Categories)
                .createQueryBuilder()
                .delete()
                .from('sub_categories')
                .where({ sub_category_id: id })
                .execute();
            if (deleted.affected == 0) {
                res.send({ message: 'This sub category is not found' });
                return;
            }
            else if (deleted.affected == 1) {
                res.send({ message: 'This sub category is deleted successfully' });
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
    // update sub category by id
    async UpdateSubCategory(req, res) {
        try {
            const { subId } = req.params;
            const valid = (0, validate_id_1.validateId)({ id: subId });
            const { error, value } = (0, validate_sub_category_2.validateUpdateSubCategory)(req.body);
            if (error || valid?.error) {
                res.send({ message: error?.message || valid?.error?.message });
                return;
            }
            const { title, category_id } = value;
            const { id } = valid.value;
            const updated = await config_1.default
                .getRepository(sub_categories_entities_1.Sub_Categories)
                .createQueryBuilder()
                .update(sub_categories_entities_1.Sub_Categories)
                .set({ sub_category_title: title, categories: category_id })
                .where('sub_category_id = :id', { id: id })
                .execute();
            if (updated.affected == 0) {
                res.send({ message: 'This sub category is not found' });
                return;
            }
            else if (updated.affected == 1) {
                res.send({ message: 'This sub category is updated successfully' });
                return;
            }
            else {
                res.send({ message: 'Something went wrong' });
                return;
            }
        }
        catch (error) {
            res.send({ massage: error });
        }
    }
}
exports.default = new SubCategoryController();

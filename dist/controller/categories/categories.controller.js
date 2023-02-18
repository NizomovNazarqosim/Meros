"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const redis_1 = require("../../config/redis");
const categories_entities_1 = require("../../entities/categories.entities");
const validate_category_1 = require("../../validations/validate.category");
const validate_id_1 = require("./../../validations/validate.id");
class CategoriesController {
    // getting all categories
    async GetCategories(req, res) {
        try {
            const client = await (0, redis_1.Client)();
            const all = await client?.get('categories');
            if (all) {
                res.send(JSON.parse(all));
            }
            else {
                const allCategories = await config_1.default
                    .getRepository(categories_entities_1.Categories)
                    .find({ relations: { sub_categories: { sub_types: { products: true } } } });
                await client?.setEx('categories', 3600, JSON.stringify(allCategories));
                res.status(200).json(allCategories);
            }
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // adding new category
    async AddCategory(req, res) {
        try {
            const { error, value } = (0, validate_category_1.validateCategory)(req.body);
            if (error) {
                res.send({ message: error?.details[0].message });
                return;
            }
            const { category_title } = value;
            const existingCategory = await config_1.default
                .getRepository(categories_entities_1.Categories)
                .find({ where: { category_title: category_title } });
            if (existingCategory.length) {
                res.status(401).json({ message: 'Category already exists' });
                return;
            }
            await config_1.default.getRepository(categories_entities_1.Categories).createQueryBuilder().insert().into(categories_entities_1.Categories).values(value).execute();
            res.json({
                message: 'Category added successfully'
            });
        }
        catch (error) {
            res.status(400).send({ message: error });
        }
    }
    //  delete category by id
    async DeleteCategory(req, res) {
        try {
            console.log('id');
            const { categoryId } = req.params;
            console.log(categoryId);
            console.log(req);
            const { error, value } = (0, validate_id_1.validateId)({ id: categoryId });
            if (error) {
                res.status(500).json({ message: error.message });
                return;
            }
            const { id } = value;
            console.log(id);
            const deleted = await config_1.default
                .getRepository(categories_entities_1.Categories)
                .createQueryBuilder()
                .delete()
                .from(categories_entities_1.Categories)
                .where({ category_id: id })
                .execute();
            if (deleted.affected == 0) {
                res.send({ message: 'This category is not found' });
                return;
            }
            else if (deleted.affected == 1) {
                res.send({ message: 'This category is deleted successfully' });
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
    // update category by id
    async UpdateCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const valid = (0, validate_id_1.validateId)({ id: categoryId });
            const { error, value } = (0, validate_category_1.validateUpdateCategory)(req.body);
            if (error) {
                res.status(500).json({ message: error?.message });
                return;
            }
            if (valid.error) {
                res.status(500).json({ message: valid?.error?.message });
                return;
            }
            const { title } = value;
            const { id } = valid.value;
            const updated = await config_1.default
                .getRepository(categories_entities_1.Categories)
                .createQueryBuilder()
                .update(categories_entities_1.Categories)
                .set({ category_title: title })
                .where('category_id = :id', { id: id })
                .execute();
            if (updated.affected == 0) {
                res.send({ message: 'This category is not found' });
                return;
            }
            else if (updated.affected == 1) {
                res.send({ message: 'This category is updated successfully' });
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
exports.default = new CategoriesController();

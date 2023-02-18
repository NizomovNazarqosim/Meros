"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const sub_types_entities_1 = require("../../entities/sub_types.entities");
const sub_categories_entities_1 = require("../../entities/sub_categories.entities");
const validate_sub_types_1 = require("./../../validations/validate.sub_types");
const validate_id_1 = require("../../validations/validate.id");
const validate_sub_types_2 = require("../../validations/validate.sub_types");
const redis_1 = require("../../config/redis");
class Sub_Types_Controller {
    // get all sub_type
    async Get_Sub_Types(req, res) {
        try {
            const client = await (0, redis_1.Client)();
            const all = await client?.get('sub_types');
            if (all) {
                res.send(JSON.parse(all));
                return;
            }
            else {
                const allSub_Sub_Category = await config_1.default.getRepository(sub_types_entities_1.Sub_Types).find({
                    relations: {
                        products: true
                    }
                });
                await client?.setEx('sub_types', 3600, JSON.stringify(allSub_Sub_Category));
                res.status(200).send(allSub_Sub_Category);
            }
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // add new sub_type
    async Add_Sub_Types(req, res) {
        try {
            const { error, value } = (0, validate_sub_types_1.validateSubTypes)(req.body);
            if (error) {
                res.status(400).send(error.message);
                return;
            }
            const { title, subCategoryId } = value;
            const isHaveSubCategory = await config_1.default.getRepository(sub_categories_entities_1.Sub_Categories).findOne({
                where: {
                    sub_category_id: subCategoryId
                }
            });
            if (!isHaveSubCategory) {
                res.json('This sub category is not found');
                return;
            }
            const isHave = await config_1.default.getRepository(sub_types_entities_1.Sub_Types).findOne({
                where: {
                    sub_type_title: title
                }
            });
            if (isHave) {
                res.send({ message: 'This sub type already exists' });
                return;
            }
            const added = await config_1.default
                .getRepository(sub_types_entities_1.Sub_Types)
                .createQueryBuilder()
                .insert()
                .into(sub_types_entities_1.Sub_Types)
                .values({
                sub_type_title: title,
                sub_categories: subCategoryId
            })
                .execute();
            res.send('Sub_types is added successfully');
        }
        catch (error) {
            res.send(error);
        }
    }
    // delete sub_type by id
    async Delete_Sub_Types(req, res) {
        try {
            const { typeId } = req.params;
            const { error, value } = (0, validate_id_1.validateId)({ id: typeId });
            if (error) {
                res.status(500).json({ message: error.message });
                return;
            }
            const { id } = value;
            const deleted = await config_1.default
                .getRepository(sub_types_entities_1.Sub_Types)
                .createQueryBuilder()
                .delete()
                .from(sub_types_entities_1.Sub_Types)
                .where({ sub_type_id: id })
                .execute();
            if (deleted.affected == 0) {
                res.send({ message: 'This sub type is not found' });
                return;
            }
            else if (deleted.affected == 1) {
                res.send({ message: 'This sub type is deleted successfully' });
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
    // update sub_type by id
    async UpdateSubType(req, res) {
        try {
            const { typeId } = req.params;
            const valid = (0, validate_id_1.validateId)({ id: typeId });
            const { error, value } = (0, validate_sub_types_2.validateUpdateSubTypes)(req.body);
            if (error || valid.error) {
                res.send({ message: error?.message ?? valid.error?.message });
                return;
            }
            const { id } = valid.value;
            console.log(value, id);
            const updated = await config_1.default
                .getRepository(sub_types_entities_1.Sub_Types)
                .createQueryBuilder()
                .update()
                .set(value)
                .where('sub_type_id = :id', { id: id })
                .execute();
            console.log(updated);
            if (updated.affected == 0) {
                res.send({ message: 'This sub type is not found' });
                return;
            }
            else if (updated.affected == 1) {
                res.send({ message: 'This sub type is updated successfully' });
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
exports.default = new Sub_Types_Controller();

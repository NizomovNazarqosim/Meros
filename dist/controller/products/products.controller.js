"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const validate_product_1 = require("../../validations/validate.product");
const validate_id_1 = require("./../../validations/validate.id");
const jwt_1 = require("../../utils/jwt");
const orders_entities_1 = require("../../entities/orders.entities");
const products_entities_1 = require("./../../entities/products.entities");
const validate_product_2 = require("./../../validations/validate.product");
const typeorm_1 = require("typeorm");
const sub_types_entities_1 = require("./../../entities/sub_types.entities");
const redis_1 = require("../../config/redis");
class ProductsController {
    // getting all products
    async GetAllProducts(req, res) {
        try {
            const client = await (0, redis_1.Client)();
            const all = await client?.get('products');
            if (all) {
                res.status(201).json(JSON.parse(all));
                return;
            }
            else {
                const allProducts = await config_1.default.getRepository(products_entities_1.Products).find();
                await client?.setEx('products', 15, JSON.stringify(allProducts));
                res.status(200).json(allProducts);
            }
        }
        catch (error) {
            res.status(500).send({ message: error });
        }
    }
    // adding new product
    async AddProducts(req, res) {
        try {
            const { error, value } = (0, validate_product_1.validateProduct)(req.body);
            const { title, price, rate, description, made_in, img, subTypeId } = value;
            if (error) {
                res.send({ message: error.details[0].message });
                return;
            }
            const existingProduct = await config_1.default.getRepository(products_entities_1.Products).find({
                where: {
                    product_title: title
                }
            });
            if (existingProduct.length) {
                res.status(501).json({
                    message: 'Product already exists'
                });
                return;
            }
            await config_1.default
                .getRepository(products_entities_1.Products)
                .createQueryBuilder()
                .insert()
                .into(products_entities_1.Products)
                .values({
                product_title: title,
                product_price: price,
                product_rate: rate,
                product_description: description,
                made_in: made_in,
                product_img: img,
                sub_types: subTypeId
            })
                .execute();
            res.status(201).json({
                message: 'Product added successfully'
            });
        }
        catch (error) {
            res.status(500).send({ message: error });
        }
    }
    // delete product by product id
    async DeleteProduct(req, res) {
        try {
            const { productId } = req.params;
            const { error, value } = (0, validate_id_1.validateId)({ id: productId });
            if (error) {
                res.status(500).send({ message: error.message });
                return;
            }
            const { id } = value;
            const deleted = await config_1.default
                .getRepository(products_entities_1.Products)
                .createQueryBuilder()
                .delete()
                .from(products_entities_1.Products)
                .where({ product_id: id })
                .execute();
            if (deleted.affected == 0) {
                res.send({ message: 'This product is not found' });
                return;
            }
            else if (deleted.affected == 1) {
                res.send({ message: 'Product deleted successfully' });
                return;
            }
            else {
                res.send({ message: 'Something went wrong please tyy once' });
            }
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // product single page
    async GetProductSinglePage(req, res) {
        try {
            const { productId } = req.params;
            const { error, value } = (0, validate_id_1.validateId)({ id: productId });
            if (error) {
                res.status(500).send({ message: error.message });
                return;
            }
            const { id } = value;
            const foundProduct = await config_1.default.getRepository(products_entities_1.Products).find({ where: { product_id: id } });
            if (!foundProduct.length) {
                res.status(401).json({ message: 'Product not found' });
                return;
            }
            res.status(200).send({ message: foundProduct });
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // update product information
    async UpdateProduct(req, res) {
        try {
            const { productId } = req.params;
            const validate = (0, validate_id_1.validateId)({ id: productId });
            if (validate.error) {
                res.send({ message: validate.error.message });
                return;
            }
            const { id } = validate.value;
            const { error, value } = (0, validate_product_1.validateUpdateProduct)(req.body);
            if (error) {
                res.status(500).send({ message: error.message });
                return;
            }
            const isHaveSubType = await config_1.default.getRepository(sub_types_entities_1.Sub_Types).find({
                where: { sub_type_id: value.sub_types }
            });
            if (!isHaveSubType.length) {
                res.send({ message: 'This sub type not found' });
                return;
            }
            const updated = await config_1.default
                .getRepository(products_entities_1.Products)
                .createQueryBuilder()
                .update(products_entities_1.Products)
                .set(value)
                .where('product_id = :id', { id: productId })
                .execute();
            if (updated.affected == 0) {
                res.status(401).json({ message: 'Product not found' });
                return;
            }
            else if (updated.affected == 1) {
                res.status(200).send({ message: 'Product successfully updated' });
                return;
            }
            else {
                res.status(500).send({ message: 'Something went wrong' });
                return;
            }
        }
        catch (error) {
            res.send(error);
        }
    }
    // buy product
    async BuyProducts(req, res) {
        try {
            const access_token = req?.headers.token;
            const { productId } = req.body;
            if (!access_token) {
                res.send('Provide token');
                return;
            }
            const valid = (0, validate_id_1.validateId)({ id: productId });
            if (valid.error) {
                res.send({ message: valid?.error?.message });
                return;
            }
            const verifyed = await (0, jwt_1.verifyToken)(String(access_token));
            const maked = await String(verifyed).split('"')[1];
            const isHaveProduct = await config_1.default.getRepository(products_entities_1.Products).findOne({ where: { product_id: productId } });
            if (!isHaveProduct) {
                res.send({ message: 'This product not found' });
                return;
            }
            const added = await config_1.default
                .getRepository(orders_entities_1.Orders)
                .createQueryBuilder()
                .insert()
                .into(orders_entities_1.Orders)
                .values({ products: productId, users: maked })
                .execute();
            res.send({ message: 'You successfully buy this product' });
        }
        catch (error) {
            res.send(error);
        }
    }
    async AddDiscount(req, res) {
        try {
            const { error, value } = (0, validate_product_2.validateDiscount)(req.body);
            if (error) {
                res.send({ message: error.message });
                return;
            }
            const { productId, discount } = value;
            const isHaveProduct = await config_1.default.getRepository(products_entities_1.Products).findOne({ where: { product_id: productId } });
            if (!isHaveProduct) {
                res.send({ message: 'This product not found' });
                return;
            }
            await config_1.default
                .getRepository(products_entities_1.Products)
                .createQueryBuilder()
                .update(products_entities_1.Products)
                .set({ discount: discount })
                .where('product_id = :id', { id: productId })
                .execute();
            res.send({ message: 'You successfully update discount part' });
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // give a rate to product
    async GiveRate(req, res) {
        try {
            const { productId, rate } = req.body;
            const { error, value } = (0, validate_id_1.validateId)({ id: productId });
            if (error) {
                res.send({ message: error.message });
                return;
            }
            const { id } = value;
            const isHave = await config_1.default.getRepository(products_entities_1.Products).findOne({ where: { product_id: id } });
            if (!isHave) {
                res.send({ message: 'This product not found' });
                return;
            }
            if (isHave.product_rate.length) {
                await config_1.default
                    .getRepository(products_entities_1.Products)
                    .createQueryBuilder()
                    .update(products_entities_1.Products)
                    .set({ product_rate: [rate, ...isHave.product_rate] })
                    .where('product_id = :id', { id: productId })
                    .execute();
            }
            else {
                await config_1.default
                    .getRepository(products_entities_1.Products)
                    .createQueryBuilder()
                    .update(products_entities_1.Products)
                    .set({ product_rate: [rate] })
                    .where('product_id = :id', { id: productId })
                    .execute();
            }
            res.send({ message: 'You give rate to this product' });
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // give discount products
    async GetDiscountProducts(req, res) {
        try {
            const getAllDiscount = await config_1.default.getRepository(products_entities_1.Products).find({
                where: {
                    discount: (0, typeorm_1.MoreThan)(0)
                },
                order: {
                    discount: 'ASC'
                }
            });
            res.send(getAllDiscount);
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // get products by rating
    async GetProductsByRating(req, res) {
        try {
            const all = await config_1.default.query(`
      SELECT p.product_id,
         p.product_rate,
(p.product_rate),
         (SELECT SUM(x) FROM UNNEST(p.product_rate) x) as totalRate
    FROM products p 
    ORDER BY totalRate DESC;
     `);
            res.send(all);
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // pagination part (page-1)*limit and limit
    async GetProductsPagination(req, res) {
        try {
            const { page, limit } = req.query;
            const pages = Number(page);
            const limits = Number(limit);
            const result = await config_1.default.getRepository(products_entities_1.Products).find({
                skip: (pages - 1) * limits,
                take: limits
            });
            res.send(result);
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    // sorting part
    async GetSorted(req, res) {
        try {
            const allProducts = await config_1.default.getRepository(products_entities_1.Products).find({
                order: {
                    product_title: 'DESC'
                }
            });
            res.status(200).json(allProducts);
        }
        catch (error) {
            res.status(500).send({ message: error });
        }
    }
}
exports.default = new ProductsController();

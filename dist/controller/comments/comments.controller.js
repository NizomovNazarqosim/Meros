"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const jwt_1 = require("../../utils/jwt");
const products_entities_1 = require("./../../entities/products.entities");
const comments_entities_1 = require("./../../entities/comments.entities");
const users_entities_1 = require("./../../entities/users.entities");
class CommentsController {
    async GetAllComments(req, res) {
        try {
            const allComments = await config_1.default.getRepository(comments_entities_1.Comments).find();
            res.status(200).json(allComments);
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    async AddComment(req, res) {
        try {
            const token = req.header('token');
            if (!token) {
                res.send('You dont have token');
                return;
            }
            const verifyed = await (0, jwt_1.verifyToken)(token);
            const maked = await String(verifyed).split('"')[1];
            const { title, productId } = req.body;
            const isHaveProduct = await config_1.default.getRepository(products_entities_1.Products).findOne({ where: { product_id: productId } });
            if (!isHaveProduct) {
                res.send({ message: 'This product is not found' });
                return;
            }
            const isHave = await config_1.default.getRepository(comments_entities_1.Comments).findOne({ where: { comment_title: title } });
            if (isHave) {
                res.send({ message: 'This comment is already' });
                return;
            }
            await config_1.default
                .getRepository(comments_entities_1.Comments)
                .createQueryBuilder()
                .insert()
                .into(comments_entities_1.Comments)
                .values({ comment_title: title, user_id: maked, products: productId })
                .execute();
            res.send({ message: 'You add comment successfully' });
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    async UpdateComment(req, res) {
        try {
            const token = req.header('token');
            const { commentId } = req.params;
            const { title } = req.body;
            if (!token) {
                res.send('You dont have token');
                return;
            }
            const verifyed = await (0, jwt_1.verifyToken)(token);
            const maked = await String(verifyed).split('"')[1];
            const isHaveUser = await config_1.default.getRepository(users_entities_1.Users).findOne({ where: { user_id: maked } });
            if (!isHaveUser) {
                res.send({ message: 'This user is not found' });
                return;
            }
            const isHaveComment = await config_1.default.getRepository(comments_entities_1.Comments).findOne({ where: { comment_id: commentId } });
            console.log(isHaveComment);
            if (!isHaveComment) {
                res.send({ message: 'This comment is not found' });
                return;
            }
            await config_1.default
                .createQueryBuilder()
                .update(comments_entities_1.Comments)
                .set({
                comment_title: title
            })
                .where('comment_id = :id', { id: commentId })
                .andWhere('user_id = :user', { user: maked })
                .execute();
            res.send({ message: 'You update comment successfully' });
        }
        catch (error) {
            res.send({ message: error });
        }
    }
    async deleteComment(req, res) {
        try {
            const token = req.header('token');
            const { commentId } = req.params;
            if (!token) {
                res.send('You dont have token');
                return;
            }
            const isHaveComment = await config_1.default.getRepository(comments_entities_1.Comments).findOne({ where: { comment_id: commentId } });
            if (!isHaveComment) {
                res.send({ message: 'This comment is not found' });
                return;
            }
            const verifyed = await (0, jwt_1.verifyToken)(token);
            const maked = await String(verifyed).split('"')[1];
            await config_1.default
                .getRepository(comments_entities_1.Comments)
                .createQueryBuilder()
                .delete()
                .from('comments')
                .where('comment_id = :id', { id: commentId })
                .andWhere('user_id = :user', { user: maked })
                .execute();
            res.send({ message: 'Comment deleted' });
        }
        catch (error) {
            res.send({ message: error });
        }
    }
}
exports.default = new CommentsController();

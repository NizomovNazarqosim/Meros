import { Request, Response } from 'express'
import dataSource from '../../config/config'
import { verifyToken } from '../../utils/jwt'
import { Products } from './../../entities/products.entities'
import { Comments } from './../../entities/comments.entities'
import { Users } from './../../entities/users.entities'

class CommentsController {
  public async GetAllComments(req: Request, res: Response) {
    try {
      const allComments = await dataSource.getRepository(Comments).find()
      res.status(200).json(allComments)
    } catch (error) {
      res.send({ message: error })
    }
  }
  public async AddComment(req: Request, res: Response) {
    try {
      const token = req.header('token')

      if (!token) {
        res.send('You dont have token')
        return
      }

      const verifyed = await verifyToken(token)

      const maked = await String(verifyed).split('"')[1]
      const { title, productId } = req.body
      const isHaveProduct = await dataSource.getRepository(Products).findOne({ where: { product_id: productId } })
      if (!isHaveProduct) {
        res.send({ message: 'This product is not found' })
        return
      }
      const isHave = await dataSource.getRepository(Comments).findOne({ where: { comment_title: title } })
      if (isHave) {
        res.send({ message: 'This comment is already' })
        return
      }
      await dataSource
        .getRepository(Comments)
        .createQueryBuilder()
        .insert()
        .into(Comments)
        .values({ comment_title: title, user_id: maked, products: productId })
        .execute()
      res.send({ message: 'You add comment successfully' })
    } catch (error) {
      res.send({ message: error })
    }
  }
  public async UpdateComment(req: Request, res: Response) {
    try {
      const token = req.header('token')
      const { commentId } = req.params
      const { title } = req.body

      if (!token) {
        res.send('You dont have token')
        return
      }
      const verifyed = await verifyToken(token)
      const maked = await String(verifyed).split('"')[1]

      const isHaveUser = await dataSource.getRepository(Users).findOne({ where: { user_id: maked } })
      if (!isHaveUser) {
        res.send({ message: 'This user is not found' })
        return
      }
      const isHaveComment = await dataSource.getRepository(Comments).findOne({ where: { comment_id: commentId } })
      console.log(isHaveComment)
      if (!isHaveComment) {
        res.send({ message: 'This comment is not found' })
        return
      }

      await dataSource
        .createQueryBuilder()
        .update(Comments)
        .set({
          comment_title: title
        })
        .where('comment_id = :id', { id: commentId })
        .andWhere('user_id = :user', { user: maked })
        .execute()

      res.send({ message: 'You update comment successfully' })
    } catch (error) {
      res.send({ message: error })
    }
  }
  public async deleteComment(req: Request, res: Response) {
    try {
      const token = req.header('token')
      const { commentId } = req.params

      if (!token) {
        res.send('You dont have token')
        return
      }

      const isHaveComment = await dataSource.getRepository(Comments).findOne({ where: { comment_id: commentId } })
      if (!isHaveComment) {
        res.send({ message: 'This comment is not found' })
        return
      }

      const verifyed = await verifyToken(token)
      const maked = await String(verifyed).split('"')[1]
      await dataSource
        .getRepository(Comments)
        .createQueryBuilder()
        .delete()
        .from('comments')
        .where('comment_id = :id', { id: commentId })
        .andWhere('user_id = :user', { user: maked })
        .execute()

      res.send({ message: 'Comment deleted' })
    } catch (error) {
      res.send({ message: error })
    }
  }
}

export default new CommentsController()

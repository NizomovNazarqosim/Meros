import { Request, Response } from 'express'
import dataSource from '../../config/config'
import { Client } from '../../config/redis'
import { Categories } from '../../entities/categories.entities'
import { validateCategory, validateUpdateCategory } from '../../validations/validate.category'
import { validateId } from './../../validations/validate.id'

class CategoriesController {
  // getting all categories
  public async GetCategories(req: Request, res: Response) {
    try {
      const client = await Client()
      const all = await client?.get('categories')
      if (all) {
        res.send(JSON.parse(all))
      } else {
        const allCategories = await dataSource
          .getRepository(Categories)
          .find({ relations: { sub_categories: { sub_types: { products: true } } } })
        await client?.setEx('categories', 3600, JSON.stringify(allCategories))
        res.status(200).json(allCategories)
      }
    } catch (error) {
      res.send({ message: error })
    }
  }
  // adding new category
  public async AddCategory(req: Request, res: Response) {
    try {
      const { error, value } = validateCategory(req.body)
      if (error) {
        res.send({ message: error?.details[0].message })
        return
      }
      const { category_title } = value
      const existingCategory = await dataSource
        .getRepository(Categories)
        .find({ where: { category_title: category_title } })
      if (existingCategory.length) {
        res.status(401).json({ message: 'Category already exists' })
        return
      }
      await dataSource.getRepository(Categories).createQueryBuilder().insert().into(Categories).values(value).execute()

      res.json({
        message: 'Category added successfully'
      })
    } catch (error) {
      res.status(400).send({ message: error })
    }
  }
  //  delete category by id
  public async DeleteCategory(req: Request, res: Response) {
    try {
      console.log('id')
      const { categoryId } = req.params
      console.log(categoryId)
      console.log(req)
      const { error, value } = validateId({ id: categoryId })
      if (error) {
        res.status(500).json({ message: error.message })
        return
      }
      const { id } = value
      console.log(id)

      const deleted = await dataSource
        .getRepository(Categories)
        .createQueryBuilder()
        .delete()
        .from(Categories)
        .where({ category_id: id })
        .execute()

      if (deleted.affected == 0) {
        res.send({ message: 'This category is not found' })
        return
      } else if (deleted.affected == 1) {
        res.send({ message: 'This category is deleted successfully' })
        return
      } else {
        res.send({ message: 'Something went wrong' })
        return
      }
    } catch (error) {
      res.send({ message: error })
    }
  }
  // update category by id
  public async UpdateCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params
      const valid = validateId({ id: categoryId })
      const { error, value } = validateUpdateCategory(req.body)

      if (error) {
        res.status(500).json({ message: error?.message })
        return
      }
      if (valid.error) {
        res.status(500).json({ message: valid?.error?.message })
        return
      }
      const { title } = value
      const { id } = valid.value

      const updated = await dataSource
        .getRepository(Categories)
        .createQueryBuilder()
        .update(Categories)
        .set({ category_title: title })
        .where('category_id = :id', { id: id })
        .execute()
      if (updated.affected == 0) {
        res.send({ message: 'This category is not found' })
        return
      } else if (updated.affected == 1) {
        res.send({ message: 'This category is updated successfully' })
        return
      } else {
        res.send({ message: 'Something went wrong' })
        return
      }
    } catch (error) {
      res.send({ message: error })
    }
  }
}

export default new CategoriesController()

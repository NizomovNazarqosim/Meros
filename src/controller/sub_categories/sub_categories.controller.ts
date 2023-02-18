import { Request, Response } from 'express'
import dataSource from '../../config/config'
import { Categories } from '../../entities/categories.entities'
import { Sub_Categories } from '../../entities/sub_categories.entities'
import { validateSubCategory } from './../../validations/validate.sub_category'
import { validateId } from './../../validations/validate.id'
import { validateUpdateSubCategory } from '../../validations/validate.sub_category'
import { Client } from '../../config/redis'

class SubCategoryController {
  // getting all sub categories
  public async GetSubCategories(req: Request, res: Response) {
    try {
      const client = await Client()
      const all = await client?.get('sub_categories')
      if (all) {
        res.send(JSON.parse(all))
        return
      } else {
        const allSubCategories = await dataSource.getRepository(Sub_Categories).find({
          relations: {
            sub_types: {
              products: true
            }
          }
        })
        await client?.setEx('sub_categories', 3600, JSON.stringify(allSubCategories))
        res.status(200).send(allSubCategories)
      }
    } catch (error) {
      res.status(500).send({ message: error })
    }
  }
  // adding new sub category
  public async AddSubCategory(req: Request, res: Response) {
    try {
      const { error, value } = validateSubCategory(req.body)
      if (error) {
        res.status(501).json({ message: error })
        return
      }

      const { sub_category_title, category_id } = value

      const isHaveCategory = await dataSource.getRepository(Categories).findOneByOrFail({
        category_id: category_id
      })
      if (!isHaveCategory) {
        res.status(404).json({ message: 'Category not found' })
        return
      }
      const existing = await dataSource
        .getRepository(Sub_Categories)
        .find({ where: { sub_category_title: sub_category_title } })
      if (existing.length) {
        res.send({ message: 'This sub category already exists' })
        return
      }

      await dataSource
        .getRepository(Sub_Categories)
        .createQueryBuilder()
        .insert()
        .into('sub_categories')
        .values({
          sub_category_title: sub_category_title,
          categories: category_id
        })
        .execute()

      res.status(201).json({
        message: 'Sub category added successfully'
      })
    } catch (error) {
      res.status(500).send({ message: error })
    }
  }
  // delete sub category by id
  public async DeleteSubCategory(req: Request, res: Response) {
    try {
      const { subId } = req.params
      const { error, value } = validateId({ id: subId })
      if (error) {
        res.send({ message: error.message })
        return
      }
      const { id } = value

      const deleted = await dataSource
        .getRepository(Sub_Categories)
        .createQueryBuilder()
        .delete()
        .from('sub_categories')
        .where({ sub_category_id: id })
        .execute()

      if (deleted.affected == 0) {
        res.send({ message: 'This sub category is not found' })
        return
      } else if (deleted.affected == 1) {
        res.send({ message: 'This sub category is deleted successfully' })
        return
      } else {
        res.send({ message: 'Something went wrong' })
        return
      }
    } catch (error) {
      res.send({ message: error })
    }
  }
  // update sub category by id
  public async UpdateSubCategory(req: Request, res: Response) {
    try {
      const { subId } = req.params
      const valid = validateId({ id: subId })
      const { error, value } = validateUpdateSubCategory(req.body)
      if (error || valid?.error) {
        res.send({ message: error?.message || valid?.error?.message })
        return
      }
      const { title, category_id } = value
      const { id } = valid.value
      const updated = await dataSource
        .getRepository(Sub_Categories)
        .createQueryBuilder()
        .update(Sub_Categories)
        .set({ sub_category_title: title, categories: category_id })
        .where('sub_category_id = :id', { id: id })
        .execute()
      if (updated.affected == 0) {
        res.send({ message: 'This sub category is not found' })
        return
      } else if (updated.affected == 1) {
        res.send({ message: 'This sub category is updated successfully' })
        return
      } else {
        res.send({ message: 'Something went wrong' })
        return
      }
    } catch (error) {
      res.send({ massage: error })
    }
  }
}

export default new SubCategoryController()

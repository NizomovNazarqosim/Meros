import dataSource from '../../config/config'
import { Sub_Types } from '../../entities/sub_types.entities'
import { Request, Response } from 'express'
import { Sub_Categories } from '../../entities/sub_categories.entities'
import { validateSubTypes } from './../../validations/validate.sub_types'
import { validateId } from '../../validations/validate.id'
import { validateUpdateSubTypes } from '../../validations/validate.sub_types'
import { Client } from '../../config/redis'

class Sub_Types_Controller {
  // get all sub_type
  public async Get_Sub_Types(req: Request, res: Response) {
    try {
      const client = await Client()
      const all = await client?.get('sub_types')
      if (all) {
        res.send(JSON.parse(all))
        return
      } else {
        const allSub_Sub_Category = await dataSource.getRepository(Sub_Types).find({
          relations: {
            products: true
          }
        })
        await client?.setEx('sub_types', 3600, JSON.stringify(allSub_Sub_Category))
        res.status(200).send(allSub_Sub_Category)
      }
    } catch (error) {
      res.send({ message: error })
    }
  }
  // add new sub_type
  public async Add_Sub_Types(req: Request, res: Response) {
    try {
      const { error, value } = validateSubTypes(req.body)
      if (error) {
        res.status(400).send(error.message)
        return
      }
      const { title, subCategoryId } = value

      const isHaveSubCategory = await dataSource.getRepository(Sub_Categories).findOne({
        where: {
          sub_category_id: subCategoryId
        }
      })
      if (!isHaveSubCategory) {
        res.json('This sub category is not found')
        return
      }
      const isHave = await dataSource.getRepository(Sub_Types).findOne({
        where: {
          sub_type_title: title
        }
      })
      if (isHave) {
        res.send({ message: 'This sub type already exists' })
        return
      }

      const added = await dataSource
        .getRepository(Sub_Types)
        .createQueryBuilder()
        .insert()
        .into(Sub_Types)
        .values({
          sub_type_title: title,
          sub_categories: subCategoryId
        })
        .execute()

      res.send('Sub_types is added successfully')
    } catch (error) {
      res.send(error)
    }
  }
  // delete sub_type by id
  public async Delete_Sub_Types(req: Request, res: Response) {
    try {
      const { typeId } = req.params
      const { error, value } = validateId({ id: typeId })
      if (error) {
        res.status(500).json({ message: error.message })
        return
      }
      const { id } = value
      const deleted = await dataSource
        .getRepository(Sub_Types)
        .createQueryBuilder()
        .delete()
        .from(Sub_Types)
        .where({ sub_type_id: id })
        .execute()

      if (deleted.affected == 0) {
        res.send({ message: 'This sub type is not found' })
        return
      } else if (deleted.affected == 1) {
        res.send({ message: 'This sub type is deleted successfully' })
        return
      } else {
        res.send({ message: 'Something went wrong' })
        return
      }
    } catch (error) {
      res.send({ message: error })
    }
  }
  // update sub_type by id
  public async UpdateSubType(req: Request, res: Response) {
    try {
      const { typeId } = req.params
      const valid = validateId({ id: typeId })
      const { error, value } = validateUpdateSubTypes(req.body)
      if (error || valid.error) {
        res.send({ message: error?.message ?? valid.error?.message })
        return
      }
      const { id } = valid.value
      console.log(value, id)

      const updated = await dataSource
        .getRepository(Sub_Types)
        .createQueryBuilder()
        .update()
        .set(value)
        .where('sub_type_id = :id', { id: id })
        .execute()
      console.log(updated)
      if (updated.affected == 0) {
        res.send({ message: 'This sub type is not found' })
        return
      } else if (updated.affected == 1) {
        res.send({ message: 'This sub type is updated successfully' })
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

export default new Sub_Types_Controller()

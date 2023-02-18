import { Request, Response } from 'express'
import dataSource from '../../config/config'
import { validateProduct, validateUpdateProduct } from '../../validations/validate.product'
import { validateId } from './../../validations/validate.id'
import { verifyToken } from '../../utils/jwt'
import { Orders } from '../../entities/orders.entities'
import { Products } from './../../entities/products.entities'
import { validateDiscount } from './../../validations/validate.product'
import { MoreThan } from 'typeorm'
import { Sub_Types } from './../../entities/sub_types.entities'
import { Client } from '../../config/redis'

class ProductsController {
  // getting all products
  public async GetAllProducts(req: Request, res: Response) {
    try {
      const client = await Client()
      const all = await client?.get('products')
      if (all) {
        res.status(201).json(JSON.parse(all))
        return
      } else {
        const allProducts: Products[] = await dataSource.getRepository(Products).find()
        await client?.setEx('products', 15, JSON.stringify(allProducts))
        res.status(200).json(allProducts)
      }
    } catch (error) {
      res.status(500).send({ message: error })
    }
  }
  // adding new product
  public async AddProducts(req: Request, res: Response) {
    try {
      const { error, value } = validateProduct(req.body)
      const { title, price, rate, description, made_in, img, subTypeId } = value
      if (error) {
        res.send({ message: error.details[0].message })
        return
      }
      const existingProduct = await dataSource.getRepository(Products).find({
        where: {
          product_title: title
        }
      })

      if (existingProduct.length) {
        res.status(501).json({
          message: 'Product already exists'
        })
        return
      }
      await dataSource
        .getRepository(Products)
        .createQueryBuilder()
        .insert()
        .into(Products)
        .values({
          product_title: title,
          product_price: price,
          product_rate: rate,
          product_description: description,
          made_in: made_in,
          product_img: img,
          sub_types: subTypeId
        })
        .execute()

      res.status(201).json({
        message: 'Product added successfully'
      })
    } catch (error) {
      res.status(500).send({ message: error })
    }
  }
  // delete product by product id
  public async DeleteProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params
      const { error, value } = validateId({ id: productId })
      if (error) {
        res.status(500).send({ message: error.message })
        return
      }
      const { id } = value
      const deleted = await dataSource
        .getRepository(Products)
        .createQueryBuilder()
        .delete()
        .from(Products)
        .where({ product_id: id })
        .execute()

      if (deleted.affected == 0) {
        res.send({ message: 'This product is not found' })
        return
      } else if (deleted.affected == 1) {
        res.send({ message: 'Product deleted successfully' })
        return
      } else {
        res.send({ message: 'Something went wrong please tyy once' })
      }
    } catch (error) {
      res.send({ message: error })
    }
  }
  // product single page
  public async GetProductSinglePage(req: Request, res: Response) {
    try {
      const { productId } = req.params
      const { error, value } = validateId({ id: productId })
      if (error) {
        res.status(500).send({ message: error.message })
        return
      }
      const { id } = value
      const foundProduct = await dataSource.getRepository(Products).find({ where: { product_id: id } })
      if (!foundProduct.length) {
        res.status(401).json({ message: 'Product not found' })
        return
      }

      res.status(200).send({ message: foundProduct })
    } catch (error) {
      res.send({ message: error })
    }
  }
  // update product information
  public async UpdateProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params
      const validate = validateId({ id: productId })
      if (validate.error) {
        res.send({ message: validate.error.message })
        return
      }
      const { id } = validate.value
      const { error, value } = validateUpdateProduct(req.body)
      if (error) {
        res.status(500).send({ message: error.message })
        return
      }
      const isHaveSubType = await dataSource.getRepository(Sub_Types).find({
        where: { sub_type_id: value.sub_types }
      })

      if (!isHaveSubType.length) {
        res.send({ message: 'This sub type not found' })
        return
      }

      const updated = await dataSource
        .getRepository(Products)
        .createQueryBuilder()
        .update(Products)
        .set(value)
        .where('product_id = :id', { id: productId })
        .execute()

      if (updated.affected == 0) {
        res.status(401).json({ message: 'Product not found' })
        return
      } else if (updated.affected == 1) {
        res.status(200).send({ message: 'Product successfully updated' })
        return
      } else {
        res.status(500).send({ message: 'Something went wrong' })
        return
      }
    } catch (error) {
      res.send(error)
    }
  }
  // buy product
  public async BuyProducts(req: Request, res: Response) {
    try {
      const access_token = req?.headers.token
      const { productId } = req.body

      if (!access_token) {
        res.send('Provide token')
        return
      }
      const valid = validateId({ id: productId })
      if (valid.error) {
        res.send({ message: valid?.error?.message })
        return
      }
      const verifyed = await verifyToken(String(access_token))
      const maked: any = await String(verifyed).split('"')[1]
      const isHaveProduct = await dataSource.getRepository(Products).findOne({ where: { product_id: productId } })
      if (!isHaveProduct) {
        res.send({ message: 'This product not found' })
        return
      }

      const added = await dataSource
        .getRepository(Orders)
        .createQueryBuilder()
        .insert()
        .into(Orders)
        .values({ products: productId, users: maked })
        .execute()

      res.send({ message: 'You successfully buy this product' })
    } catch (error) {
      res.send(error)
    }
  }
  public async AddDiscount(req: Request, res: Response) {
    try {
      const { error, value } = validateDiscount(req.body)
      if (error) {
        res.send({ message: error.message })
        return
      }
      const { productId, discount } = value
      const isHaveProduct = await dataSource.getRepository(Products).findOne({ where: { product_id: productId } })
      if (!isHaveProduct) {
        res.send({ message: 'This product not found' })
        return
      }
      await dataSource
        .getRepository(Products)
        .createQueryBuilder()
        .update(Products)
        .set({ discount: discount })
        .where('product_id = :id', { id: productId })
        .execute()
      res.send({ message: 'You successfully update discount part' })
    } catch (error) {
      res.send({ message: error })
    }
  }
  // give a rate to product
  public async GiveRate(req: Request, res: Response) {
    try {
      const { productId, rate } = req.body
      const { error, value } = validateId({ id: productId })
      if (error) {
        res.send({ message: error.message })
        return
      }
      const { id } = value
      const isHave = await dataSource.getRepository(Products).findOne({ where: { product_id: id } })
      if (!isHave) {
        res.send({ message: 'This product not found' })
        return
      }

      if (isHave.product_rate.length) {
        await dataSource
          .getRepository(Products)
          .createQueryBuilder()
          .update(Products)
          .set({ product_rate: [rate, ...isHave.product_rate] })
          .where('product_id = :id', { id: productId })
          .execute()
      } else {
        await dataSource
          .getRepository(Products)
          .createQueryBuilder()
          .update(Products)
          .set({ product_rate: [rate] })
          .where('product_id = :id', { id: productId })
          .execute()
      }

      res.send({ message: 'You give rate to this product' })
    } catch (error) {
      res.send({ message: error })
    }
  }
  // give discount products
  public async GetDiscountProducts(req: Request, res: Response) {
    try {
      const getAllDiscount = await dataSource.getRepository(Products).find({
        where: {
          discount: MoreThan(0)
        },
        order: {
          discount: 'ASC'
        }
      })
      res.send(getAllDiscount)
    } catch (error) {
      res.send({ message: error })
    }
  }
  // get products by rating
  public async GetProductsByRating(req: Request, res: Response) {
    try {
      const all = await dataSource.query(`
      SELECT p.product_id,
         p.product_rate,
(p.product_rate),
         (SELECT SUM(x) FROM UNNEST(p.product_rate) x) as totalRate
    FROM products p 
    ORDER BY totalRate DESC;
     `)

      res.send(all)
    } catch (error) {
      res.send({ message: error })
    }
  }
  // pagination part (page-1)*limit and limit
  public async GetProductsPagination(req: Request, res: Response) {
    try {
      const { page, limit } = req.query
      const pages = Number(page)
      const limits = Number(limit)
      const result = await dataSource.getRepository(Products).find({
        skip: (pages - 1) * limits,
        take: limits
      })
      res.send(result)
    } catch (error) {
      res.send({ message: error })
    }
  }
  // sorting part
  public async GetSorted(req: Request, res: Response) {
    try {
      const allProducts = await dataSource.getRepository(Products).find({
        order: {
          product_title: 'DESC'
        }
      })
      res.status(200).json(allProducts)
    } catch (error) {
      res.status(500).send({ message: error })
    }
  }
}

export default new ProductsController()

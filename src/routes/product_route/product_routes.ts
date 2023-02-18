import { Router } from 'express'
import productsController from '../../controller/products/products.controller'
import { isAdmin } from './../../middlewares/verify_admin'

const router = Router()

export default router
  .get('/get', productsController.GetAllProducts)
  .get('/get/:productId', isAdmin(), productsController.GetProductSinglePage)
  .post('/add', isAdmin(), productsController.AddProducts)
  .delete('/delete/:productId', isAdmin(), productsController.DeleteProduct)
  .patch('/update/:productId', productsController.UpdateProduct)
  .post('/buy', productsController.BuyProducts)
  .put('/discount', isAdmin(), productsController.AddDiscount)
  .put('/rate', productsController.GiveRate)
  .get('/discount', productsController.GetDiscountProducts)
  .get('/rating', productsController.GetProductsByRating)
  .get('/pagination', productsController.GetProductsPagination)
  .get('/sorted', productsController.GetSorted)

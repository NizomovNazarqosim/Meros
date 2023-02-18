import { Router } from 'express'
import { categoriesController } from '../../controller/index'
import { isAdmin } from '../../middlewares/verify_admin'

const router = Router()

export default router
  .get('/get', categoriesController.GetCategories)
  .post('/add', isAdmin(), categoriesController.AddCategory)
  .delete('/delete/:categoryId', isAdmin(), categoriesController.DeleteCategory)
  .patch('/update/:categoryId', isAdmin(), categoriesController.UpdateCategory)

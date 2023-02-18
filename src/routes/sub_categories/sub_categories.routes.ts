import { Router } from 'express'
import sub_categoriesController from '../../controller/sub_categories/sub_categories.controller'
import { isAdmin } from '../../middlewares/verify_admin'

const router = Router()

export default router
  .get('/get', sub_categoriesController.GetSubCategories)
  .post('/add', isAdmin(), sub_categoriesController.AddSubCategory)
  .delete('/delete/:subId', isAdmin(), sub_categoriesController.DeleteSubCategory)
  .patch('/update/:subId', isAdmin(), sub_categoriesController.UpdateSubCategory)

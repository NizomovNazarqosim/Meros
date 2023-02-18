import { Router } from 'express'
import sub_types_controller from '../../controller/sub_types.controller/sub_types_controller'
import { isAdmin } from './../../middlewares/verify_admin'

const router = Router()

export default router
  .get('/get', sub_types_controller.Get_Sub_Types)
  .post('/add', isAdmin(), sub_types_controller.Add_Sub_Types)
  .delete('/delete/:typeId', isAdmin(), sub_types_controller.Delete_Sub_Types)
  .patch('/update/:typeId', isAdmin(), sub_types_controller.UpdateSubType)

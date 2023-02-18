import { Router } from 'express'
import usersController from '../../controller/users/users.controller'
import { isAdmin } from '../../middlewares/verify_admin'

const router = Router()

export default router
  .post('/register', usersController.REGISTER)
  .post('/login', usersController.LOGIN)
  .post('/logout', usersController.LOGOUT)
  .post('/create/admin', isAdmin(), usersController.AddAdmin)
  .patch('/update', usersController.UpdateUser)

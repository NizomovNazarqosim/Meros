import { Router } from 'express'
import commentsController from '../../controller/comments/comments.controller'

const router = Router()

export default router
  .get('/get', commentsController.GetAllComments)
  .post('/add', commentsController.AddComment)
  .patch('/update/:commentId', commentsController.UpdateComment)
  .delete('/delete/:commentId', commentsController.deleteComment)

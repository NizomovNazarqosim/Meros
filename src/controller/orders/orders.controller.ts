import dataSource from '../../config/config'
import { Request, Response } from 'express'
import { Orders } from '../../entities/orders.entities'
import { verifyToken } from './../../utils/jwt'

class OrderController {
  public async getOrders(req: Request, res: Response) {
    try {
    } catch (error) {
      res.send({ message: error })
    }
  }
}

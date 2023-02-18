import { Response, Request, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import dataSource from '../config/config'
import { Users } from '../entities/users.entities'
import jwt from 'jsonwebtoken'

export const isAdmin = () => async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('token')

  if (!token) {
    res.send('You dont have token')
    return
  }

  const verifyByToken = (payload: string) => {
    return new Promise((resolve, reject) => {
      jwt.verify(payload, '1q2w3e4r', (err: unknown, token: any) => {
        if (err) return res.send({ message: 'Failed in checking uuid' })
        resolve(token.id)
      })
    })
  }

  const verifyed = await verifyByToken(token)

  const maked = await String(verifyed).split('"')[1]

  const foundUser = await await dataSource
    .createQueryBuilder()
    .select('users')
    .from(Users, 'users')
    .where('user_id = :id', { id: maked })
    .getOne()

  if (foundUser?.role == 'admin') {
    next()
    return
  }

  res.send('You are not an admin')
}

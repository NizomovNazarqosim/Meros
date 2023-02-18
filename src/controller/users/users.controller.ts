import dataSource from '../../config/config'
import { Users } from '../../entities/users.entities'
import { Response, Request } from 'express'
import { validateLogin, validateRegister } from '../../validations/validate.user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { verifyToken } from './../../utils/jwt'
import { sendEmail } from '../../utils/nodemailer'
import { validateUserUpdate } from './../../validations/validate.user'

class UsersController {
  // registration only user part
  public async REGISTER(req: Request, res: Response) {
    try {
      const { error, value } = await validateRegister(req.body)
      if (error) {
        res.send(error?.details[0].message)
        return
      }
      const { firstname, lastname, email, password } = value

      const existing = await dataSource.getRepository(Users).findOne({
        where: {
          firstname: firstname,
          email: email
        }
      })

      if (existing && !existing.deleted_at) {
        res.status(401).json('You are already registered')
        return
      }

      if (existing && existing.deleted_at) {
        const id = existing.user_id
        await dataSource
          .getRepository(Users)
          .createQueryBuilder()
          .update(Users)
          .set({ deleted_at: '' })
          .where('user_id = :id', { id: id })
          .execute()
        const bearer_token = await jwt.sign({ id: id }, '1q2w3e4r', { expiresIn: 36000 })
        const refresh_token = await jwt.sign({ id: id }, '1q2w3e4r', { expiresIn: 36000 })
        res.json({
          bearer_token: bearer_token,
          refresh_token: refresh_token
        })
        return
      }

      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)

      const newUser = await dataSource
        .getRepository(Users)
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values({
          firstname,
          lastname,
          email,
          password: hashed,
          role: 'user'
        })
        .execute()

      // await sendEmail('nazarqosimnizomov@gmail.com')
      //   .then((response) => console.log(response))
      //   .catch((error) => console.log(error))

      const userId = await newUser.identifiers[0].user_id

      const bearer_token = await jwt.sign({ id: userId }, '1q2w3e4r', { expiresIn: 36000 })
      const refresh_token = await jwt.sign({ id: userId }, '1q2w3e4r', { expiresIn: 36000 })
      res.json({
        bearer_token: bearer_token,
        refresh_token: refresh_token
      })
    } catch (error) {
      res.send(error)
    }
  }
  // login part
  public async LOGIN(req: Request, res: Response) {
    try {
      const { error, value } = await validateLogin(req.body)
      if (error) {
        res.send(error?.details[0].message)
        return
      }

      const { firstname, email, password } = value

      const existing = await dataSource.getRepository(Users).findOne({
        where: {
          firstname: firstname,
          email: email
        }
      })

      if (!existing || existing.deleted_at) {
        res.status(401).json('You are not registered yet')
        return
      }

      const validPassword = await bcrypt.compare(password, existing.password)

      if (!validPassword) {
        res.send('You do not have the correct password')
        return
      }
      const userId = await JSON.stringify(existing.user_id)
      const bearer_token = await jwt.sign({ id: userId }, '1q2w3e4r', { expiresIn: 36000 })
      const refresh_token = await jwt.sign({ id: userId }, '1q2w3e4r', { expiresIn: 36000 })
      res.json({
        bearer_token: bearer_token,
        refresh_token: refresh_token
      })
    } catch (error) {
      res.send(error)
    }
  }
  //   logout part
  public async LOGOUT(req: Request, res: Response) {
    try {
      const { bearer_token } = req.body
      const verifyed = await verifyToken(String(bearer_token))
      const maked = await String(verifyed).split('"')[1]
      const foundUser = await dataSource
        .getRepository(Users)
        .createQueryBuilder()
        .update('users')
        .set({ deleted_at: Date.now() })
        .where('user_id = :id', { id: maked })
        .execute()

      res.send('You are logged out')
    } catch (error) {
      res.send(error)
    }
  }
  // adding new admin this can only by admin
  public async AddAdmin(req: Request, res: Response) {
    try {
      const { error, value } = await validateRegister(req.body)
      if (error) {
        res.send(error?.details[0].message)
        return
      }
      const { firstname, lastname, email, password } = value

      const existing = await dataSource.getRepository(Users).findOne({
        where: {
          firstname: firstname,
          email: email,
          role: 'admin'
        }
      })

      if (existing) {
        res.status(401).json('This admin already have')
        return
      }

      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)

      const newUser = await dataSource
        .getRepository(Users)
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values({
          firstname,
          lastname,
          email,
          password: hashed,
          role: 'admin'
        })
        .execute()

      // await sendEmail('nazarqosimnizomov@gmail.com')
      //   .then((response) => console.log(response))
      //   .catch((error) => console.log(error))

      res.json({
        message: 'You add admin'
      })
    } catch (error) {
      res.send(error)
    }
  }
  // update user by userId
  public async UpdateUser(req: Request, res: Response) {
    try {
      const token = req.header('token')
      if (!token) {
        res.send('You dont have token')
        return
      }
      const verifyed = await verifyToken(token)
      const maked = await String(verifyed).split('"')[1]
      const { error, value } = validateUserUpdate(req.body)
      if (error) {
        res.send({ message: error })
        return
      }
      //
      const updated = await dataSource
        .getRepository(Users)
        .createQueryBuilder()
        .update()
        .set(value)
        .where('user_id = :id', { id: maked })
        .execute()
      if (updated.affected == 0) {
        res.send({ message: 'This user is not found' })
        return
      } else if (updated.affected == 1) {
        res.send({ message: 'This user is updated successfully' })
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

export default new UsersController()

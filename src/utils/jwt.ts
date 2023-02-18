import * as jwt from 'jsonwebtoken'

export const verifyToken = (payload: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(payload, '1q2w3e4r', (err: unknown, token: any) => {
      if (err) reject(err)
      resolve(token.id)
    })
  })
}

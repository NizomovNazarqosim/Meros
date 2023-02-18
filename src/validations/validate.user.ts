import Joi from 'joi'

export const validateRegister = (data: { firstname: string; lastname: string; email: string; password: string }) => {
  const registerSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })

  return registerSchema.validate(data)
}

export const validateLogin = (data: { username: string; password: string }) => {
  const loginSchema = Joi.object({
    firstname: Joi.string().required(),
    password: Joi.string().required().min(6),
    email: Joi.string().email().required()
  })
  return loginSchema.validate(data)
}

export const validateUserUpdate = (data: { firstname: string; lastname: string; email: string; password: string }) => {
  const userUpdateSchema = Joi.object({
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional()
  })

  return userUpdateSchema.validate(data)
}

import Joi from 'joi'

export const validateId = (data: { id: string }) => {
  const idSchema = Joi.object({
    id: Joi.string().required().uuid()
  })
  return idSchema.validate(data)
}

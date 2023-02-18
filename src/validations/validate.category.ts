import Joi from 'joi'

export const validateCategory = (data: { category_title: string }) => {
  const categorySchema = Joi.object({
    category_title: Joi.string().required()
  })
  return categorySchema.validate(data)
}
export const validateUpdateCategory = (data: { title: string; id: string }) => {
  const categoryUpdateSchema = Joi.object({
    title: Joi.string().required()
  })
  return categoryUpdateSchema.validate(data)
}

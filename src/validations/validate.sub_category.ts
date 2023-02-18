import Joi from 'joi'

export const validateSubCategory = (data: { sub_category_title: string; category_id: string }) => {
  const sub_categorySchema = Joi.object({
    sub_category_title: Joi.string().required(),
    category_id: Joi.string().required().uuid()
  })
  return sub_categorySchema.validate(data)
}
export const validateUpdateSubCategory = (data: { sub_category_title: string; category_id: string }) => {
  const sub_categoryUpdateSchema = Joi.object({
    title: Joi.string().optional(),
    category_id: Joi.string().optional().uuid()
  })
  return sub_categoryUpdateSchema.validate(data)
}

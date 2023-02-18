import Joi from 'joi'

export const validateSubTypes = (data: { title: string; subCategoryId: string }) => {
  const sub_typesSchema = Joi.object({
    title: Joi.string().required(),
    subCategoryId: Joi.string().required().uuid()
  })
  return sub_typesSchema.validate(data)
}
export const validateUpdateSubTypes = (data: { title: string; subCategoryId: string }) => {
  const sub_typesUpdateSchema = Joi.object({
    sub_type_title: Joi.string().optional(),
    sub_categories: Joi.string().optional().uuid()
  })
  return sub_typesUpdateSchema.validate(data)
}

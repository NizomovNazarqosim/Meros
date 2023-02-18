import Joi from 'joi'

export const validateProduct = (data: {
  title: string
  price: string
  rate: number | undefined
  description: string | undefined
  made_in: string
  img: string
  subTypeId: string
}) => {
  const productSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.string().required(),
    rate: Joi.number().required().optional(),
    description: Joi.string().required().optional(),
    made_in: Joi.string().required(),
    img: Joi.string().required(),
    subTypeId: Joi.string().required().uuid()
  })
  return productSchema.validate(data)
}

export const validateUpdateProduct = (data: any) => {
  const updateProductSchema = Joi.object({
    product_title: Joi.string().optional(),
    product_price: Joi.string().optional(),
    product_rate: Joi.alternatives().try(Joi.number(), Joi.allow(null)).optional(),
    product_description: Joi.string().optional(),
    discount: Joi.alternatives().try(Joi.number(), Joi.allow(null)).optional(),
    made_in: Joi.string().optional(),
    sub_types: Joi.string().optional().uuid(),
    product_img: Joi.string().optional()
  })
  return updateProductSchema.validate(data)
}
export const validateDiscount = (data: any) => {
  const discountSchema = Joi.object({
    productId: Joi.string().uuid().required(),
    discount: Joi.alternatives().try(Joi.number(), Joi.allow(null)).required()
  })
  return discountSchema.validate(data)
}

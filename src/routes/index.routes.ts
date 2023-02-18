import { Router } from 'express'
import usersRoutes from './user_route/users.routes'
import categoriesRoutes from './category_route/categories.routes'
import sub_categoriesRoutes from './sub_categories/sub_categories.routes'
import sub_types from './sub_types.route/sub_types_categories.routes'
import product_routes from './product_route/product_routes'
import commentsRoutes from './comments/comments.routes'

const routerIndex = Router()

export default routerIndex
  .use('/users', usersRoutes)
  .use('/categories', categoriesRoutes)
  .use('/subcategories', sub_categoriesRoutes)
  .use('/subtypes', sub_types)
  .use('/products', product_routes)
  .use('/comments', commentsRoutes)

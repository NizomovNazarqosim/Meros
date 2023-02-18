import express from 'express'
import dataSource from './config/config'
import indexRoutes from './routes/index.routes'
import dotenv from 'dotenv'
import swagger from 'swagger-ui-express'
import docs from './docs.json'

dotenv.config()
const port = process.env.PORT || 9000

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

dataSource
  .initialize()
  .then(() => console.log('Connected'))
  .catch((err) => console.log(err))

app.use(indexRoutes)
app.use('/api', swagger.serve, swagger.setup(docs))
app.listen(9000, () => {
  console.log(`http://localhost:${9000}`)
})

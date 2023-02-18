import { DataSource } from 'typeorm'
import path from 'path'

export default new DataSource({
  type: 'postgres',
  host: 'kashin.db.elephantsql.com',
  port: 5432,
  username: 'fxqdjrdd',
  password: 'BIF_ymhVy1KHDk7uNV4dHXw-hDoIl6RZ',
  database: 'fxqdjrdd',
  entities: [path.join(__dirname, '..', 'entities', '*.entities.{ts,js}')],
  migrations: [path.join(__dirname, '..', 'migrations', '*.migration.{ts,js}')],
  logging: true,
  synchronize: true
})

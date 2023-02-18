import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Products } from './products.entities'

@Entity({ name: 'comments' })
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  comment_id: string

  @Column()
  user_id: string

  @Column()
  comment_title: string

  @ManyToOne(() => Products, (products) => products.comments)
  products: Products
}

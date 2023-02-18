import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm'
import { Orders } from './orders.entities'
import { Sub_Types } from './sub_types.entities'
import { Comments } from './comments.entities'

@Entity({ name: 'products' })
export class Products {
  @PrimaryGeneratedColumn('uuid')
  product_id: string

  @Column()
  product_title: string

  @Column()
  product_price: string

  @Column('integer', {
    nullable: true,
    array: true,
    default: []
  })
  product_rate: number[]

  @Column({
    nullable: true
  })
  product_description: string

  @Column({
    nullable: true
  })
  made_in: string

  @Column({
    nullable: true
  })
  discount: number

  @Column({
    nullable: true
  })
  product_img: string

  @CreateDateColumn({ default: new Date() })
  created_at: Date

  @ManyToOne(() => Sub_Types, (sub_types) => sub_types.products, { onDelete: 'CASCADE', cascade: true })
  sub_types: Sub_Types

  @OneToOne(() => Orders, (orders) => orders.products)
  @JoinColumn()
  orders: Orders

  @OneToMany(() => Comments, (comments) => comments.products, { onDelete: 'NO ACTION' })
  comments: Comments[]
}

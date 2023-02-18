import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { Users } from './users.entities'
import { Products } from './products.entities'

@Entity({ name: 'orders' })
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  order_id: string

  @ManyToOne(() => Users, (users) => users.orders)
  users: Users

  @OneToOne(() => Products, { onDelete: 'NO ACTION' })
  @JoinColumn()
  products: Products

  @CreateDateColumn({ default: new Date() })
  created_at: Date
}

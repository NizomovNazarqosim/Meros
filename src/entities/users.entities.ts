import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { Orders } from './orders.entities'

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_id: string

  @Column()
  firstname: string

  @Column()
  lastname: string

  @Column()
  email: string

  @Column({ nullable: true })
  role: string

  @Column()
  password: string

  @CreateDateColumn({ default: new Date() })
  created_at: Date

  @Column({ nullable: true })
  deleted_at?: string

  @OneToMany(() => Orders, (orders) => orders.users)
  orders: Orders[]
}

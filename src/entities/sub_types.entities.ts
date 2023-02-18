import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Products } from './products.entities'
import { Sub_Categories } from './sub_categories.entities'

@Entity({ name: 'sub_types' })
export class Sub_Types {
  @PrimaryGeneratedColumn('uuid')
  sub_type_id: string

  @Column()
  sub_type_title: string

  @ManyToOne(() => Sub_Categories, (sub_categories) => sub_categories.sub_types, { onDelete: 'CASCADE', cascade: true })
  sub_categories: Sub_Categories

  @OneToMany(() => Products, (products) => products.sub_types)
  products: Products[]
}

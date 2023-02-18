import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Categories } from './categories.entities'
import { Sub_Types } from './sub_types.entities'

@Entity({ name: 'sub_categories' })
export class Sub_Categories {
  @PrimaryGeneratedColumn('uuid')
  sub_category_id: string

  @Column()
  sub_category_title: string

  @ManyToOne(() => Categories, (categories) => categories.sub_categories, { onDelete: 'CASCADE', cascade: true })
  categories: Categories

  @OneToMany(() => Sub_Types, (sub_types) => sub_types.sub_categories)
  sub_types: Sub_Types[]
}

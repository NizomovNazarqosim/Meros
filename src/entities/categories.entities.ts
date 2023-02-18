import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Sub_Categories } from './sub_categories.entities'

@Entity({ name: 'categories' })
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  category_id: string

  @Column()
  category_title: string

  @OneToMany(() => Sub_Categories, (sub_categories) => sub_categories.categories)
  sub_categories: Sub_Categories[]
}

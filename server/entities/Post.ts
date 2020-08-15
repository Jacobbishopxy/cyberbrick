/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToMany,
  JoinTable
} from "typeorm"
import { Category } from "./Category"

@Entity({name: "post"})
export class Post {

  @PrimaryGeneratedColumn()
  id!: number

  @Column("text")
  @Index({ unique: true })
  title!: string

  @Column("text")
  text!: string

  @ManyToMany(() => Category, category => category.posts, { cascade: true })
  @JoinTable()
  categories?: Category[]
}


/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryColumn,
  ManyToMany,
  Column
} from "typeorm"
import { Post } from "./Post"

@Entity({name: "category"})
export class Category {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", {nullable: true})
  description?: string

  @ManyToMany(() => Post, post => post.categories)
  posts?: Post[]
}


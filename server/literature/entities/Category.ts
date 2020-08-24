/**
 * Created by Jacob Xie on 8/19/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm"
import * as common from "../common"
import { Tag } from "./Tag"

import { Article } from "./Article"

@Entity({ name: common.category })
export class Category {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @OneToMany(() => Article, article => article.category)
  articles!: Article[]

  @ManyToMany(() => Tag, tag => tag.categories, { cascade: true })
  @JoinTable()
  unionTags!: Tag[]
}

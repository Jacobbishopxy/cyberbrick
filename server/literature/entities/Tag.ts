/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  Column
} from "typeorm"
import * as common from "../common"
import { Article } from "./Article"
import { Category } from "./Category"

@Entity({ name: common.tag })
export class Tag {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @OneToMany(() => Category, category => category.article)
  category!: Category

  @ManyToMany(() => Article, article => article.tags)
  articles!: Article[]
}

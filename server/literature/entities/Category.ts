/**
 * Created by Jacob Xie on 8/19/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
} from "typeorm"
import { category } from "../common"
import { Article } from "./Article"

@Entity({ name: category })
export class Category {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @OneToMany(() => Article, article => article.author)
  articles!: Article[]
}

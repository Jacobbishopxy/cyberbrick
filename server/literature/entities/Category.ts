/**
 * Created by Jacob Xie on 8/19/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
} from "typeorm"
import * as common from "../common"
import { Article } from "./Article"
import { Tag} from "./Tag"

@Entity({ name: common.category })
export class Category {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @OneToMany(() => Article, article => article.category)
  articles!: Article[]

  @OneToMany(() => Tag, tag => tag.category)
  tags!: Tag[]
}

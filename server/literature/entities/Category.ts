/**
 * Created by Jacob Xie on 8/19/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm"
import * as common from "../common"
import { Article } from "./Article"
import { Tag } from "./Tag"

@Entity({ name: common.category })
export class Category {

  @PrimaryGeneratedColumn()
  id!: number

  @Column("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @ManyToOne(() => Article, article => article.category)
  article!: Article

  @ManyToOne(() => Tag, tag => tag.category)
  tag!: Tag
}

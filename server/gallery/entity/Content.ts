/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from "typeorm"

import * as common from "../common"
import { Element } from "./Element"
import { Category } from "./Category"
import { Tag } from "./Tag"
import { Mark } from "./Mark"
import { Author } from "./Author"

@Entity({ name: common.content })
export class Content {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @ManyToOne(() => Element, e => e.contents, { nullable: false })
  element!: Element

  @ManyToOne(() => Category, c => c.contents, { nullable: false })
  category!: Category

  @ManyToOne(() => Mark, m => m.contents, { cascade: true, nullable: true })
  mark!: Mark

  @ManyToMany(() => Tag, t => t.contents, { cascade: true, nullable: true })
  tags!: Tag[]

  @ManyToOne(() => Author, a => a.contents, { nullable: true })
  author!: Author

  @Column("timestamp", { nullable: false })
  date!: string

  @Column("text", { nullable: false })
  title!: string

  @Column("json", { nullable: false })
  data!: Record<string, any>

  @Column("json", { nullable: true })
  config?: Record<string, any>
}


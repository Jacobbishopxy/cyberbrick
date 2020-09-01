/**
 * Created by Jacob Xie on 9/1/2020.
 */

import {
  Entity,
  PrimaryColumn,
  ManyToMany,
  Column,
  JoinTable
} from "typeorm"
import * as common from "../common"
import { Category } from "./Category"
import { Content } from "./Content"

@Entity({ name: common.tag })
export class Tag {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @ManyToMany(() => Category, c => c.unionTags)
  categories!: Category[]

  @ManyToMany(() => Content, c => c.tags)
  @JoinTable()
  contents!: Content[]
}

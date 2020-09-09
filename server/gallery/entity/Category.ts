/**
 * Created by Jacob Xie on 9/1/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn
} from "typeorm"
import * as common from "../common"
import { Tag } from "./Tag"
import { Mark } from "./Mark"
import { Content } from "./Content"
import { Dashboard } from "./Dashboard"


@Entity({ name: common.category })
export class Category {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @OneToOne(() => Dashboard, { cascade: true, nullable: true })
  @JoinColumn()
  dashboard!: Dashboard

  @ManyToMany(() => Mark, s => s.categories, { cascade: true, nullable: true })
  @JoinTable()
  unionMarks!: Mark[]

  @ManyToMany(() => Tag, t => t.categories, { cascade: true, nullable: true })
  @JoinTable()
  unionTags!: Tag[]

  @OneToMany(() => Content, c => c.category, { nullable: true })
  contents!: Content[]
}

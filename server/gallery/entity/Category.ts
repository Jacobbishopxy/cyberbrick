/**
 * Created by Jacob Xie on 9/1/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  Unique
} from "typeorm"
import * as common from "../common"
import { Tag } from "./Tag"
import { Mark } from "./Mark"
import { Content } from "./Content"
import { Dashboard } from "./Dashboard"


@Entity({ name: common.category })
@Unique([common.name, common.dashboard])
export class Category {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @OneToOne(() => Dashboard, d => d.category, { cascade: true, nullable: true })
  @JoinColumn()
  dashboard!: Dashboard

  @OneToMany(() => Mark, s => s.category, { cascade: true, nullable: true })
  marks!: Mark[]

  @OneToMany(() => Tag, t => t.category, { cascade: true, nullable: true })
  tags!: Tag[]

  @OneToMany(() => Content, c => c.category, { nullable: true })
  contents!: Content[]
}

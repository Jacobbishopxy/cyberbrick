/**
 * Created by Jacob Xie on 9/1/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import * as common from "../common"
import {Tag} from "./tag.entity"
import {Mark} from "./mark.entity"
import {Content} from "./content.entity"
import {Dashboard} from "./dashboard.entity"


@Entity({name: common.category})
@Unique([common.name])
export class Category {

  @PrimaryColumn("varchar")
  name!: string

  @Column("varchar", {nullable: true})
  type!: string

  @Column("text", {nullable: true})
  description?: string

  @OneToMany(() => Dashboard, d => d.category, {cascade: true, nullable: true})
  dashboards!: Dashboard[]

  @OneToMany(() => Mark, s => s.category, {cascade: true, nullable: true})
  marks!: Mark[]

  @OneToMany(() => Tag, t => t.category, {cascade: true, nullable: true})
  tags!: Tag[]

  @OneToMany(() => Content, c => c.category, {nullable: true})
  contents!: Content[]

  @CreateDateColumn({select: false})
  createdAt!: string

  @UpdateDateColumn({select: false})
  updatedAt!: string
}

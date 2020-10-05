/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique
} from "typeorm"

import * as common from "../common"
import { Template } from "./Template"
import { Content } from "./Content"


@Entity({ name: common.element })
@Unique([common.template, common.name])
export class Element {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @ManyToOne(() => Template, tmp => tmp.elements, { nullable: true })
  template!: Template

  @OneToMany(() => Content, ct => ct.element, { cascade: true, nullable: true })
  contents!: Content[]

  @Column("varchar", { nullable: false })
  name!: string

  @Column("enum", { nullable: false, enum: common.ElementType })
  type!: common.ElementType

  @Column("bool", { nullable: true })
  timeSeries!: boolean

  @Column("bigint", { nullable: false })
  x!: number

  @Column("bigint", { nullable: false })
  y!: number

  @Column("bigint", { nullable: false })
  h!: number

  @Column("bigint", { nullable: false })
  w!: number
}

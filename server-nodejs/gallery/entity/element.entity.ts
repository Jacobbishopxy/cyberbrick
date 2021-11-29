/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
  DeleteDateColumn
} from "typeorm"

import * as common from "../common"
import {Template} from "./template.entity"
import {Content} from "./content.entity"


@Entity({name: common.element})
@Unique([common.template, common.name])
export class Element {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  /**
   * if a template is deleted, its' element would be deleted as well (element's contents still remain, see `Content.ts`)
   */
  @ManyToOne(() => Template, tmp => tmp.elements, {nullable: true, onDelete: "CASCADE"})
  template!: Template

  @OneToMany(() => Content, ct => ct.element, {cascade: true, nullable: true})
  contents!: Content[]

  @Column("varchar", {nullable: false})
  name!: string

  @Column("varchar", {nullable: true})
  description?: string

  @Column("enum", {nullable: false, enum: common.ElementType})
  type!: common.ElementType

  @Column("bool", {nullable: true})
  timeSeries!: boolean

  @Column("bool", {nullable: true})
  isSubmodule!: boolean

  // this is used to determine whether the element is sub-element of another element
  // if it is, the element will be rendered beneath his parent element
  @Column("varchar", {nullable: true})
  parentName!: string

  @Column("json", {nullable: true})
  headData!: Record<string, any>

  @Column("bigint", {nullable: false})
  x!: number

  @Column("bigint", {nullable: false})
  y!: number

  @Column("bigint", {nullable: false})
  h!: number

  @Column("bigint", {nullable: false})
  w!: number

  @DeleteDateColumn()
  deletedAt?: Date
}

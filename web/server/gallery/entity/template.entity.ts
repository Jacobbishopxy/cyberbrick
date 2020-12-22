/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

import * as common from "../common"
import {Dashboard} from "./dashboard.entity"
import {Element} from "./element.entity"

@Entity({name: common.template})
@Unique([common.dashboard, common.name])
export class Template {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @ManyToOne(() => Dashboard, d => d.templates, {cascade: true, nullable: false})
  dashboard!: Dashboard

  @OneToMany(() => Element, e => e.template, {cascade: true, nullable: true})
  elements!: Element[]

  @Column("int", {nullable: true})
  index!: number

  @Column("varchar", {nullable: false})
  name!: string

  @Column("text", {nullable: true})
  description?: string

  @CreateDateColumn({select: false})
  createdAt!: string

  @UpdateDateColumn({select: false})
  updatedAt!: string
}

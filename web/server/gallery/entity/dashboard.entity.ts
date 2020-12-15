/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm"

import * as common from "../common"
import {Category} from "./category.entity"
import {Template} from "./template.entity"

@Entity({name: common.dashboard})
@Unique([common.name, common.category])
export class Dashboard {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @ManyToOne(() => Category, c => c.dashboards, {nullable: false})
  category!: Category

  @OneToMany(() => Template, t => t.dashboard, {nullable: true})
  templates!: Template[]

  @Column("varchar")
  name!: string

  @Column("text", {nullable: true})
  description?: string

  @CreateDateColumn({select: false})
  createdAt!: string

  @UpdateDateColumn({select: false})
  updatedAt!: string
}


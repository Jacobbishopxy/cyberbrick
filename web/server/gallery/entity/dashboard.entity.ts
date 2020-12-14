/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm"

import * as common from "../common"
import {Category} from "./category.entity"
import {Template} from "./template.entity"

@Entity({name: common.dashboard})
export class Dashboard {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @OneToOne(() => Category, c => c.dashboard, {nullable: false})
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


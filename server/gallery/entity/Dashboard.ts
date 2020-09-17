/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

import * as common from "../common"
import { Category } from "./Category"
import { Template } from "./Template"

@Entity({ name: common.dashboard })
export class Dashboard {

  @PrimaryColumn("varchar")
  name!: string

  @OneToOne(() => Category, c => c.dashboard, { nullable: false })
  category!: Category

  @OneToMany(() => Template, t => t.dashboard, { nullable: true })
  templates!: Template[]

  @Column("text", { nullable: true })
  description?: string

  @CreateDateColumn({ select: false })
  createdAt!: string

  @UpdateDateColumn({ select: false })
  updatedAt!: string
}


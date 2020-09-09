/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany
} from "typeorm"

import * as common from "../common"
import { Template } from "./Template"

@Entity({ name: common.dashboard })
export class Dashboard {

  @PrimaryColumn("varchar")
  name!: string

  @OneToMany(() => Template, t => t.dashboard, { cascade: true, nullable: true })
  templates!: Template[]

  @Column("text", { nullable: true })
  description?: string
}


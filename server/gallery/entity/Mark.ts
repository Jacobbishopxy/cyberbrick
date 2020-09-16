/**
 * Created by Jacob Xie on 9/1/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm"
import * as common from "../common"
import { Category } from "./Category"
import { Content } from "./Content"

@Entity({ name: common.mark })
export class Mark {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @ManyToOne(() => Category, c => c.marks, { nullable: false })
  category!: Category

  @OneToMany(() => Content, c => c.mark)
  contents!: Content[]
}

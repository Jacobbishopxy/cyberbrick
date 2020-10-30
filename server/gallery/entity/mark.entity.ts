/**
 * Created by Jacob Xie on 9/1/2020.
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
import {Category} from "./category.entity"
import {Content} from "./content.entity"

@Entity({name: common.mark})
@Unique([common.name, common.category])
export class Mark {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("varchar")
  name!: string

  @Column("varchar", {nullable: true})
  color?: string

  @Column("text", {nullable: true})
  description?: string

  @ManyToOne(() => Category, c => c.marks, {nullable: false})
  category!: Category

  @OneToMany(() => Content, c => c.mark, {nullable: true})
  contents!: Content[]
}

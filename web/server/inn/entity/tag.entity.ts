/**
 * Created by Jacob Xie on 2/4/2021
 */

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm"

import {tag} from "../common"
import {Update} from "./update.entity"


@Entity(tag)
@Unique(["name"])
export class Tag {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @ManyToMany(() => Update, u => u.tags, {nullable: true})
  @JoinTable()
  updates!: Update[]

  @Column("varchar", {nullable: false})
  name!: string

  @Column("text", {nullable: true})
  description!: string

  @Column("varchar", {nullable: true})
  color!: string
}
/**
 * Created by Jacob Xie on 10/22/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm"

import * as common from "../common"


@Entity({name: common.storage})
export class Storage {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("varchar")
  name!: string

  @Column("text", {nullable: true})
  description?: string

  @Column("enum", {nullable: false, enum: common.StorageType})
  type!: string

  @Column("varchar", {nullable: false})
  host!: string

  @Column("int", {nullable: false})
  port!: number

  @Column("varchar", {nullable: false})
  database!: string

  @Column("varchar", {nullable: false})
  username!: string

  @Column("varchar", {nullable: false})
  password!: string
}

/**
 * Created by Jacob Xie on 2/3/2021
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, ManyToMany
} from "typeorm"

import {update} from "../common"
import {Tag} from "./tag.entity"


@Entity(update)
export class Update {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @ManyToMany(() => Tag, t => t.updates, {cascade: true, nullable: true})
  tags!: Tag[]

  @Column("datetime", {nullable: false})
  date!: string

  @Column("text")
  title!: string

  @Column("text")
  data!: string

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string
}


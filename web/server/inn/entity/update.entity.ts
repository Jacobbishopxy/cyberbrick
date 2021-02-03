/**
 * Created by Jacob Xie on 2/3/2021
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column, CreateDateColumn, UpdateDateColumn
} from "typeorm"


@Entity("update")
export class Update {

  @PrimaryGeneratedColumn("uuid")
  id!: string

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


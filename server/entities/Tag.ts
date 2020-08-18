/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryColumn,
  ManyToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm"
import { Target } from "./Target"

@Entity({ name: "tag" })
export class Tag {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @ManyToMany(() => Target, target => target.tags)
  targets?: Target[]

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string

  @VersionColumn()
  version!: number
}


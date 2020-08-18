/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToMany,
  JoinTable,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm"
import { Tag } from "./Tag"

@Entity({ name: "target" })
@Unique(["category", "date"])
export class Target {

  @PrimaryGeneratedColumn()
  id!: number

  @Column("varchar")
  category!: string

  @Column("timestamp")
  date!: string

  @Column("text")
  @Index({ unique: true })
  title!: string

  @Column("text")
  text!: string

  @ManyToMany(() => Tag, tag => tag.targets, { cascade: true })
  @JoinTable()
  tags?: Tag[]

  @CreateDateColumn()
  createdAt!: string

  @UpdateDateColumn()
  updatedAt!: string

  @VersionColumn()
  version!: number
}


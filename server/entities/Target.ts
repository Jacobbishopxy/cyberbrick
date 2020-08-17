/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToMany,
  JoinTable
} from "typeorm"
import { Tag } from "./Tag"

// todo: Target needs date & category for time sorting and type filtering
@Entity({name: "target"})
export class Target {

  @PrimaryGeneratedColumn()
  id!: number

  @Column("text")
  @Index({ unique: true })
  title!: string

  @Column("text")
  text!: string

  @ManyToMany(() => Tag, tag => tag.targets, { cascade: true })
  @JoinTable()
  tags?: Tag[]
}


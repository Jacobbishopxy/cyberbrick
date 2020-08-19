/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryColumn,
  ManyToMany,
  Column,
} from "typeorm"
import { tag } from "../common"
import { Article } from "./Article"

@Entity({ name: tag })
export class Tag {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @ManyToMany(() => Article, target => target.tags)
  targets?: Article[]
}

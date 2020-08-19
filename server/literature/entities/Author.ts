/**
 * Created by Jacob Xie on 8/19/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
} from "typeorm"
import { author } from "../common"
import { Article } from "./Article"

@Entity({ name: author })
export class Author {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", { nullable: true })
  description?: string

  @OneToMany(() => Article, article => article.author)
  articles!: Article[]
}

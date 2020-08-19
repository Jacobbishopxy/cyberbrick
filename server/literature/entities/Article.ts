/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm"
import moment from "moment"

import { article } from "../common"
import { Category } from "./Category"
import { Author } from "./Author"
import { Tag } from "./Tag"

@Entity({ name: article })
@Unique(["category", "date"])
export class Article {

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Category, category => category.articles)
  category!: Category

  @Column({
    default: () => moment(),
    type: "datetime"
  })
  date!: string

  @ManyToOne(() => Author, author => author.articles)
  author!: Author

  @ManyToMany(() => Tag, tag => tag.targets, { cascade: true })
  @JoinTable()
  tags?: Tag[]

  @Column("text")
  @Index({ unique: true })
  title!: string

  @Column("text")
  text!: string

  @CreateDateColumn({ select: false })
  createdAt!: string

  @UpdateDateColumn({ select: false })
  updatedAt!: string

  @VersionColumn()
  version!: number
}


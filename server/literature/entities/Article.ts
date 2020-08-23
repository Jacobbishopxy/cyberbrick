/**
 * Created by Jacob Xie on 8/14/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm"
import moment from "moment"

import * as common from "../common"
import { Category } from "./Category"
import { Tag } from "./Tag"
import { Author } from "./Author"

@Entity({ name: common.article })
@Unique([common.category, common.date])
export class Article {

  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => Category, category => category.article)
  category!: Category

  @ManyToMany(() => Tag, tag => tag.articles, { cascade: true })
  @JoinTable()
  tags!: Tag[]

  @Column({
    default: () => moment(),
    type: "datetime"
  })
  date!: string

  @ManyToOne(() => Author, author => author.articles, { cascade: true })
  author!: Author

  @Column("text")
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


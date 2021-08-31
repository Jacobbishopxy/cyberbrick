/**
 * Created by Jacob Xie on 9/1/2020.
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany
} from "typeorm"
import {author} from "../common"
import {Content} from "./content.entity"


@Entity({name: author})
export class Author {

  @PrimaryColumn("varchar")
  name!: string

  @Column("text", {nullable: true})
  description?: string

  @OneToMany(() => Content, c => c.author, {nullable: true})
  contents!: Content[]
}


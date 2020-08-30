/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Element } from "./Element"

@Entity({ name: common.content })
export class Content {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @ManyToOne(() => Element, ele => ele.contents, { nullable: false })
  element!: Element

  @Column(utils.dateType, { nullable: false })
  date!: string

  @Column("varchar")
  symbol?: string

  @Column("text", { nullable: false })
  title!: string

  @Column("text", { nullable: false })
  text!: string
}


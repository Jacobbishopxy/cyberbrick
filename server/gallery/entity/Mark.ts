/**
 * Created by Jacob Xie on 9/1/2020.
 */

import {
  Entity,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
} from "typeorm"
import * as common from "../common"
import { Category } from "./Category"
import { Content } from "./Content"

@Entity({ name: common.symbol })
export class Mark {

  @PrimaryColumn("varchar")
  name!: string

  @ManyToMany(() => Category, c => c.unionMarks)
  categories!: Category

  @OneToMany(() => Content, c => c.mark)
  contents!: Content[]
}

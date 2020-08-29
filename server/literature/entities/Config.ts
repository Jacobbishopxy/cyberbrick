/**
 * Created by Jacob Xie on 8/29/2020.
 */

import {
  Entity,
  Column,
  Unique
} from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"

@Entity({name: common.config})
@Unique([common.templateName, common.elementName, common.symbol, common.date])
export class Config {

  @Column("varchar")
  dashboardName!: string

  @Column("varchar")
  templateName!: string

  @Column("varchar")
  elementName!: string

  @Column("varchar")
  symbol!: string

  @Column(utils.dateType)
  date!: string
}

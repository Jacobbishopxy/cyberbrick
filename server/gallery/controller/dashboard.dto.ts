/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {IsString} from "class-validator"

export class DashboardDescriptionModifyDto {
  @IsString()
  name!: string

  @IsString()
  description!: string
}


/**
 * Created by Jacob Xie on 10/26/2020.
 */

import { IsString } from "class-validator"

export class TemplateCopyElementsDto {
  @IsString()
  originDashboardName!: string

  @IsString()
  originTemplateName!: string

  @IsString()
  targetDashboardName!: string

  @IsString()
  targetTemplateName!: string
}


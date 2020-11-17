/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {IsNotEmpty, IsString} from "class-validator"

export class TemplateCopyElementsDto {
  @IsString()
  @IsNotEmpty()
  originDashboardName!: string

  @IsString()
  @IsNotEmpty()
  originTemplateName!: string

  @IsString()
  @IsNotEmpty()
  targetDashboardName!: string

  @IsString()
  @IsNotEmpty()
  targetTemplateName!: string
}


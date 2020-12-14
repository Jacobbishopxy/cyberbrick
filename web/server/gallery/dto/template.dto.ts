/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {IsNotEmpty, IsString} from "class-validator"

export class TemplateCopyElementsDto {
  @IsString()
  @IsNotEmpty()
  originTemplateId!: string

  @IsString()
  @IsNotEmpty()
  targetTemplateId!: string
}


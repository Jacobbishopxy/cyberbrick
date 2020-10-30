/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {IsOptional, IsString} from "class-validator"

export class CategoryPureDto {
  @IsString()
  name!: string

  @IsString()
  @IsOptional()
  description?: string
}

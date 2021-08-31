/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {IsNotEmpty, IsOptional, IsString} from "class-validator"

export class CategoryPureDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsOptional()
  description?: string
}

/**
 * Created by Jacob Xie on 11/16/2020
 */

import {IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator"
import {Type} from "class-transformer"


export class ReadDto {
  @IsArray()
  @IsOptional()
  selects?: string[]

  @IsString()
  @IsNotEmpty()
  tableName!: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConditionDto)
  conditions?: ConditionDto[]
}

export enum ConditionSymbol {
  Equal = "=",
  Greater = ">",
  GreaterEqual = ">=",
  Lesser = "<",
  LesserEqual = "<="
}

export class ConditionDto {
  @IsString()
  @IsNotEmpty()
  field!: string

  @IsNotEmpty()
  value!: string | number

  @IsEnum(ConditionSymbol)
  @IsNotEmpty()
  symbol!: ConditionSymbol
}

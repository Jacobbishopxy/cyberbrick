/**
 * Created by Jacob Xie on 11/16/2020
 */

import {IsArray, IsEnum, IsOptional, IsString, ValidateNested} from "class-validator"
import {Type} from "class-transformer"


export class ReadDto {
  @IsArray()
  @IsOptional()
  selects?: string[]

  @IsString()
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
  field!: string

  @IsString()
  value!: string

  @IsEnum(ConditionSymbol)
  symbol!: ConditionSymbol
}


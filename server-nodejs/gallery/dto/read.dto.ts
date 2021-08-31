/**
 * Created by Jacob Xie on 11/16/2020
 */

import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

export type ReadDto = PostgresReadDto | MongoReadDto

export class MongoReadDto {
  @IsNotEmpty()
  collection!: string
}

export class PostgresReadDto {
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

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDto)
  ordering?: OrderDto[]
}

export enum ConditionSymbol {
  Equal = "=",
  Greater = ">",
  GreaterEqual = ">=",
  Lesser = "<",
  LesserEqual = "<="
}

export enum Junction {
  AND = "AND",
  OR = "OR"
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

  @IsEnum(Junction)
  @IsOptional()
  junction?: Junction
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC"
}
export class OrderDto {
  @IsString()
  @IsNotEmpty()
  field!: string

  @IsEnum(Order)
  @IsNotEmpty()
  direction!: Order
}


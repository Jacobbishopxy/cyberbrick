/**
 * Created by Jacob Xie on 11/16/2020
 */

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { validateSync } from "class-validator"
import { plainToClass } from "class-transformer"

import { ReadDto } from "../dto"
import { MongoReadDto, PostgresReadDto } from '../dto/read.dto'


@Injectable()
export class ReadPipe implements PipeTransform<ReadDto> {
  transform(value: ReadDto): ReadDto {

    const checkPG = validateSync(plainToClass(PostgresReadDto, value))
    const checkMongo = validateSync(plainToClass(MongoReadDto, value))
    //if it's not type pg or mongo
    if (checkPG.length !== 0 && checkMongo.length !== 0)
      throw new BadRequestException("validation error")

    return value
  }
}


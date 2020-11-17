/**
 * Created by Jacob Xie on 11/16/2020
 */

import {PipeTransform, Injectable, BadRequestException} from '@nestjs/common'
import {validateSync} from "class-validator"
import {plainToClass} from "class-transformer"

import {ReadDto} from "../dto"


@Injectable()
export class ReadPipe implements PipeTransform<ReadDto> {
  transform(value: ReadDto): ReadDto {

    const check = validateSync(plainToClass(ReadDto, value))

    if (check.length !== 0)
      throw new BadRequestException("validation error")

    return value
  }
}


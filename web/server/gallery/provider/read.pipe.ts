/**
 * Created by Jacob Xie on 11/16/2020
 */

import {PipeTransform, Injectable, BadRequestException} from '@nestjs/common'

import {ReadDto, ConditionSymbol} from "./read.dto"

@Injectable()
export class ReadPipe implements PipeTransform<ReadDto> {
  transform(value: ReadDto) {

    if (!value.tableName) {
      throw new BadRequestException('key: `tableName` is required!')
    }

    if (value.conditions) {
       value.conditions.forEach(c => {
         if (!Object.values(ConditionSymbol).includes(c.symbol))
           throw new BadRequestException(`${c.symbol} is inappropriate!`)
       })
    }

    return value
  }
}


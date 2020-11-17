/**
 * Created by Jacob Xie on 11/17/2020
 */

import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common"
import {validateSync} from "class-validator"
import {plainToClass} from "class-transformer"

import {DashboardDescriptionModifyDto} from "../dto"


@Injectable()
export class DashboardDescriptionModifyPipe implements PipeTransform<DashboardDescriptionModifyDto> {
  transform(value: DashboardDescriptionModifyDto): DashboardDescriptionModifyDto {

    const check = validateSync(plainToClass(DashboardDescriptionModifyDto, value))

    if (check.length !== 0)
      throw new BadRequestException("validation error")

    return value
  }
}

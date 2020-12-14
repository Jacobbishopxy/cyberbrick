/**
 * Created by Jacob Xie on 11/17/2020
 */

import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common"
import {validateSync} from "class-validator"
import {plainToClass} from "class-transformer"

import {DashboardModifyDto} from "../dto"


@Injectable()
export class DashboardModifyPipe implements PipeTransform<DashboardModifyDto> {
  transform(value: DashboardModifyDto): DashboardModifyDto {

    const check = validateSync(plainToClass(DashboardModifyDto, value))

    if (check.length !== 0)
      throw new BadRequestException("validation error")

    return value
  }
}

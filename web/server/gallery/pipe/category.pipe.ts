/**
 * Created by Jacob Xie on 11/17/2020
 */

import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common"
import {validateSync} from "class-validator"
import {plainToClass} from "class-transformer"

import {CategoryPureDto} from "../dto"


@Injectable()
export class CategoryPurePipe implements PipeTransform<CategoryPureDto> {
  transform(value: CategoryPureDto): CategoryPureDto {

    const check = validateSync(plainToClass(CategoryPureDto, value))

    if (check.length !== 0)
      throw new BadRequestException("validation error")

    return value
  }
}


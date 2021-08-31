/**
 * Created by Jacob Xie on 11/17/2020
 */

import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common"
import {validateSync} from "class-validator"
import {plainToClass} from "class-transformer"

import {TemplateCopyElementsDto} from "../dto"


@Injectable()
export class TemplateCopyElementsPipe implements PipeTransform<TemplateCopyElementsDto> {
  transform(value: TemplateCopyElementsDto): TemplateCopyElementsDto {

    const check = validateSync(plainToClass(TemplateCopyElementsDto, value))

    if (check.length !== 0)
      throw new BadRequestException("validation error")

    return value
  }
}


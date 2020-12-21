/**
 * Created by Jacob Xie on 12/21/2020
 */

import {isNumber} from "class-validator"

import {PipeTransform, Type} from "@nestjs/common"


export class ParseArray implements PipeTransform {
  private readonly type: Type<unknown>
  private readonly separator: string

  constructor(options: any) {
    this.type = options.type
    this.separator = options.separator
  }

  parseAndValidate(value: any) {
    switch (this.type) {
      case Number:
        const parsedValue = +value
        if (!isNumber(parsedValue, {allowNaN: false, allowInfinity: false})) {
          throw new Error('Given item must be a number.')
        }
        return parsedValue

      default:
        return
    }
  }

  transform(value: any) {
    let items: any
    try {
      items = value.split(this.separator)
    } catch (error) {
      throw new Error('Given input is not parsable.')
    }

    return items.map((item: any) => {
      return this.parseAndValidate(item)
    })
  }
}
/**
 * Created by Jacob Xie on 10/3/2020.
 */

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Bind,
  Query,
  ParseBoolPipe,
  ParseIntPipe
} from '@nestjs/common'
import {FileInterceptor} from "@nestjs/platform-express"

import axios from "axios"
import FormData from "form-data"


import {serverUrl} from "../config"


@Controller()
export class FileController {

  @Post("extract")
  @UseInterceptors(FileInterceptor("file"))
  @Bind(UploadedFile())
  async extractCsvFile(file: Express.Multer.File,
                       @Query("head", ParseBoolPipe) head: boolean,
                       @Query("multiSheets") multiSheets: boolean | string,
                       @Query('numberRounding', ParseIntPipe) numberRounding: number,
                       @Query('dateFormat') dateFormat: string) {
    let url = `${serverUrl}/api/upload/extract?head=${head}`
    if (multiSheets) url += `&multiSheets=${multiSheets}`
    if (numberRounding) url += `&numberRounding=${numberRounding}`
    if (dateFormat) url += `&dateFormat=${dateFormat}`

    const form = new FormData()
    form.append("file", file.buffer, file.originalname)

    const ans = await axios.post(url, form, {headers: form.getHeaders()})

    return ans.data
  }
}

/**
 * Created by Jacob Xie on 11/11/2020
 */

import {
  Controller,
  Delete,
  Post,
  UseInterceptors,
  UploadedFile,
  Bind,
  Query,
  Body,
} from '@nestjs/common'
import {ConfigService} from "@nestjs/config"
import {FileInterceptor} from "@nestjs/platform-express"
import axios from "axios"
import FormData from "form-data"

const dbPath = "api/database"

@Controller()
export class DatabaseController {
  constructor(private configService: ConfigService) {  }

  @Post("insertByFile")
  @UseInterceptors(FileInterceptor("file"))
  @Bind(UploadedFile())
  async insertDataByFile(file: Express.Multer.File,
                         @Query("id") dbId: string,
                         @Query("insertOption") insertOption: string) {
    const serverUrl = this.configService.get("serverUrl")
    const url = `${serverUrl}/${dbPath}/insertByFile?id=${dbId}&insertOption=${insertOption}`

    const form = new FormData()
    form.append("file", file.buffer, file.originalname)

    const ans = await axios.post(url, form, {headers: form.getHeaders()})

    return ans.data
  }

  @Post("insert")
  async insertData(@Query("id") dbId: string,
                   @Query("tableName") tableName: string,
                   @Query("insertOption") insertOption: string,
                   @Body() data: Record<string, any>) {
    const serverUrl = this.configService.get("serverUrl")
    const url = `${serverUrl}/${dbPath}/insert?id=${dbId}&tableName=${tableName}&insertOption=${insertOption}`

    const ans = await axios.post(url, data)

    return ans.data
  }

  @Post("update")
  async updateData() {

  }

  @Delete("delete")
  async deleteData() {

  }

  @Post("read")
  async readData() {

  }
}


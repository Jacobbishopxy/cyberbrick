/**
 * Created by Jacob Xie on 11/11/2020
 */

import {
  Controller,
  Delete,
  Get,
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

@Controller("database")
export class DatabaseController {
  constructor(private configService: ConfigService) { }

  private getProxy() {
    const server = this.configService.get("server")
    return {proxy: {host: server.serverHost, port: server.serverPort}}
  }

  @Get("viewStorage")
  async viewStorage() {
    const url = `/${dbPath}/view-storage`
    const ans = await axios.get(url, this.getProxy())
    return ans.data
  }

  @Get("listTable")
  async listTable(@Query("id") dbId: string) {
    const url = `/${dbPath}/list-table?id=${dbId}`
    const ans = await axios.get(url, this.getProxy())
    return ans.data
  }

  @Post("insertByFile")
  @UseInterceptors(FileInterceptor("file"))
  @Bind(UploadedFile())
  async insertDataByFile(file: Express.Multer.File,
                         @Query("id") dbId: string,
                         @Query("insertOption") insertOption: string) {
    const url = `/${dbPath}/insertByFile?id=${dbId}&insertOption=${insertOption}`
    const form = new FormData()
    form.append("file", file.buffer, file.originalname)
    const ans = await axios.post(encodeURI(url), form, {...this.getProxy(), headers: form.getHeaders()})
    return ans.data
  }

  @Post("insert")
  async insertData(@Query("id") dbId: string,
                   @Query("tableName") tableName: string,
                   @Query("insertOption") insertOption: string,
                   @Body() data: Record<string, any>) {
    let url = `/${dbPath}/insert?id=${dbId}&tableName=${tableName}`
    if (insertOption) url += `&insertOption=${insertOption}`
    const ans = await axios.post(encodeURI(url), data, this.getProxy())
    return ans.data
  }

  @Post("update")
  async updateData(@Query("id") dbId: string,
                   @Query("tableName") tableName: string,
                   @Query("itemId") itemId: string,
                   @Body() data: Record<string, any>) {
    const url = `/${dbPath}/update?id=${dbId}&tableName=${tableName}&itemId=${itemId}`
    const ans = await axios.post(encodeURI(url), data, this.getProxy())
    return ans.data
  }

  @Delete("delete")
  async deleteData(@Query("id") dbId: string,
                   @Query("tableName") tableName: string,
                   @Query("itemId") itemId: string) {
    const url = `/${dbPath}/delete?id=${dbId}&tableName=${tableName}&itemId=${itemId}`
    const ans = await axios.delete(encodeURI(url), this.getProxy())
    return ans.data
  }

  @Post("read")
  async readData(@Query("id") dbId: string,
                 @Body() data: Record<string, any>) {
    const url = `/${dbPath}/read?id=${dbId}`
    const ans = await axios.post(encodeURI(url), data, this.getProxy())
    return ans.data
  }
}


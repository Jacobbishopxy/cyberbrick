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

  /**
   * get all database connection config information
   */
  @Get("viewStorage")
  async viewStorage() {
    const url = `/${dbPath}/viewStorage`
    const ans = await axios.get(url, this.getProxy())
    return ans.data
  }

  /**
   * list table in a database
   */
  @Get("listTable")
  async listTable(@Query("id") dbId: string) {
    const url = `/${dbPath}/listTable?id=${dbId}`
    const ans = await axios.get(encodeURI(url), this.getProxy())
    return ans.data
  }

  @Get("getTableColumns")
  async getTableColumns(@Query("id") dbId: string,
                        @Query("tableName") tableName: string) {
    const url = `/${dbPath}/getTableColumns?id=${dbId}&tableName=${tableName}`
    const ans = await axios.get(encodeURI(url), this.getProxy())
    return ans.data
  }

  /**
   * @param file: csv or xlsx file
   * @param dbId: database id (specified in storage)
   * @param insertOption: replace (default)/append/fail
   * @param tableName: only required when file is csv
   */
  @Post("insertByFile")
  @UseInterceptors(FileInterceptor("file"))
  @Bind(UploadedFile())
  async insertDataByFile(file: Express.Multer.File,
                         @Query("id") dbId: string,
                         @Query("insertOption") insertOption: string,
                         @Query("tableName") tableName: string) {
    let url = `/${dbPath}/insertByFile?id=${dbId}`
    if (insertOption) url += `&insertOption=${insertOption}`
    if (tableName) url += `&tableName=${tableName}`
    const form = new FormData()
    form.append("file", file.buffer, file.originalname)
    const ans = await axios.post(encodeURI(url), form, {...this.getProxy(), headers: form.getHeaders()})
    return ans.data
  }

  /**
   * drop a named table
   */
  @Delete("dropTable")
  async dropTable(@Query("id") dbId: string,
                  @Query("tableName") tableName: string) {
    const url = `/${dbPath}/dropTable?id=${dbId}&tableName=${tableName}`
    const ans = await axios.delete(encodeURI(url), this.getProxy())
    return ans.data
  }

  /**
   * insert data into a table by json data
   */
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

  /**
   * update data in a table by json data
   */
  @Post("update")
  async updateData(@Query("id") dbId: string,
                   @Query("tableName") tableName: string,
                   @Query("itemId") itemId: string,
                   @Body() data: Record<string, any>) {
    const url = `/${dbPath}/update?id=${dbId}&tableName=${tableName}&itemId=${itemId}`
    const ans = await axios.post(encodeURI(url), data, this.getProxy())
    return ans.data
  }

  /**
   * delete a row in a table
   */
  @Delete("delete")
  async deleteData(@Query("id") dbId: string,
                   @Query("tableName") tableName: string,
                   @Query("itemId") itemId: string) {
    const url = `/${dbPath}/delete?id=${dbId}&tableName=${tableName}&itemId=${itemId}`
    const ans = await axios.delete(encodeURI(url), this.getProxy())
    return ans.data
  }

  /**
   * read data from a table
   */
  @Post("read")
  async readData(@Query("id") dbId: string,
                 @Body() data: Record<string, any>) {
    const url = `/${dbPath}/read?id=${dbId}`
    const ans = await axios.post(encodeURI(url), data, this.getProxy())
    return ans.data
  }
}


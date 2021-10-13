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
} from '@nestjs/common'
import {ConfigService} from "@nestjs/config"
import {FileInterceptor} from "@nestjs/platform-express"
import axios from "axios"
import FormData from "form-data"

@Controller("upload")
export class UploadController {
  constructor(private configService: ConfigService) {}

  private getUploadPath() {
    const serverConfig = this.configService.get("server")

    return `http://${serverConfig.serverPyHost}:${serverConfig.serverPyPort}/api/upload`

  }

  @Post("extract")
  @UseInterceptors(FileInterceptor("file"))
  @Bind(UploadedFile())
  async extractFile(
    file: any,
    @Query("head") head: boolean,
    @Query("multiSheets") multiSheets: boolean | string,
    @Query('numberRounding') numberRounding: number,
    @Query('dateFormat') dateFormat: string,
    @Query("transpose") transpose: boolean
  ) {
    let url = `${this.getUploadPath()}/extract?head=${head}`
    if (multiSheets) url += `&multiSheets=${multiSheets}`
    if (numberRounding) url += `&numberRounding=${numberRounding}`
    if (dateFormat) url += `&dateFormat=${dateFormat}`
    if (transpose) url += `&transpose=${transpose}`

    const form = new FormData()
    form.append("file", file.buffer, file.originalname)

    const ans = await axios.post(url, form, {headers: form.getHeaders()})

    return ans.data
  }
}

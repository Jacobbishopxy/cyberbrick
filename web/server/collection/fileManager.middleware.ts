/**
 * Created by Jacob Xie on 1/11/2021
 */

import {Injectable, NestMiddleware} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
import {Request, Response} from "express"

import {FileManagerService} from "./fileManager.service"


@Injectable()
export class FileManagerMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService, private fmService: FileManagerService) {}

  private serverConfig = this.configService.get("server")

  use(req: Request, res: Response) {

    const fsRoot = this.serverConfig.fmRoot
    const fmm = this.fmService.generateFileManager(fsRoot)

    return fmm(req, res)
  }
}


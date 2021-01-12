/**
 * Created by Jacob Xie on 1/11/2021
 */

import {Injectable, NestMiddleware} from "@nestjs/common"
import {ConfigService} from "@nestjs/config"
import {Request, Response} from "express"
import * as fm from "@opuscapita/filemanager-server"

@Injectable()
export class FileManagerMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  private serverConfig = this.configService.get("server")

  use(req: Request, res: Response) {
    const {context} = req.params

    const fmm = fm.middleware({
      fsRoot: this.serverConfig.fmRoot,
      rootName: context
    })

    return fmm(req, res)
  }
}


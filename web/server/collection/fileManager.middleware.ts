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

    const logger = fm.logger
    logger.transports.forEach((t: any) => t.silent = true)

    const fsRoot = this.serverConfig.fmRoot
    const fmm = fm.middleware({fsRoot, logger})

    return fmm(req, res)
  }
}


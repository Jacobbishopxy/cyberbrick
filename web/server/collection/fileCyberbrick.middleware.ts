/**
 * Created by Jacob Xie on 2/8/2021
 */

import {Injectable, NestMiddleware} from "@nestjs/common"
import {Request, Response} from "express"

import {FileManagerService} from "./fileManager.service"


@Injectable()
export class FileCyberbrickMiddleware implements NestMiddleware {
  constructor(private fmService: FileManagerService) {}

  use(req: Request, res: Response) {

    const fmm = this.fmService.generateFileManager("../.")

    return fmm(req, res)
  }
}


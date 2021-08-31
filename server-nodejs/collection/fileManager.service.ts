/**
 * Created by Jacob Xie on 2/8/2021
 */

import {Injectable} from "@nestjs/common"
import * as fm from "@opuscapita/filemanager-server"


@Injectable()
export class FileManagerService {

  generateFileManager = (fsRoot: string) => {
    const logger = fm.logger
    logger.transports.forEach((t: any) => t.silent = true)

    return fm.middleware({fsRoot, logger})
  }

}


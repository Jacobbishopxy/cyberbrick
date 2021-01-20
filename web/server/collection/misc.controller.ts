/**
 * Created by Jacob Xie on 9/17/2020.
 */

import {Controller, Get, Query, Res} from '@nestjs/common'
import {Response} from "express"

import {CollectionService} from "./collection.service"


@Controller()
export class MiscController {
  constructor(private readonly service: CollectionService) {}

  @Get("misc/random-unicorn")
  async getRandomUnicorn(@Res() res: Response) {
    return res.sendFile(this.service.getRandomUnicorn())
  }

  @Get("document/gallery")
  async getDocumentGallery(@Res() res: Response) {
    return res.sendFile(this.service.getDocument("GalleryDataStructure.svg"))
  }

  @Get("document/rocket")
  async getDocumentRocket(@Res() res: Response) {
    return res.sendFile(this.service.getDocument("NewRocket.png"))
  }

  @Get("manual/getManualImage")
  async getManualImage(@Query("name") name: string,
                       @Res() res: Response) {
    return res.sendFile(this.service.getManualImage(name))
  }
}


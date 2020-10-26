/**
 * Created by Jacob Xie on 9/17/2020.
 */

import { Controller, Get, Res } from '@nestjs/common'
import { Request, Response } from "express"
import path from "path"

import { CollectionService } from "./collection.service"


export const getDocumentPng = (name: string) =>
  (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, `../../public/${ name }`))
  }

@Controller("misc")
export class MiscController {
  constructor(private readonly service: CollectionService) {}

  @Get("document/gallery")
  async getDocumentGallery(@Res() res: Response) {
    return res.sendFile(this.service.getDocument("GalleryDataStructure.svg"))
  }

  @Get("document/rocket")
  async getDocumentRocket(@Res() res: Response) {
    return res.sendFile(this.service.getDocument("NewRocket.png"))
  }
}


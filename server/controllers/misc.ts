/**
 * Created by Jacob Xie on 9/17/2020.
 */

import { Controller, Get } from '@nestjs/common'
import { Request, Response } from "express"
import path from "path"

export const getDocumentPng = (name: string) =>
  (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, `../../public/${ name }`))
  }

@Controller("misc")
export class Misc {

  private getDocument = (doc: string) =>
    path.join(__dirname, `../../public/${ doc }`)

  @Get("document/gallery")
  async getDocumentGallery() {
    return this.getDocument("GalleryDataStructure.svg")
  }

  @Get("document/rocket")
  async getDocumentRocket() {
    return this.getDocument("NewRocket.png")
  }
}


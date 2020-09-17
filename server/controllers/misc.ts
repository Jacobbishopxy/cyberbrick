/**
 * Created by Jacob Xie on 9/17/2020.
 */

import { Request, Response } from "express"
import path from "path"

export const getDocumentPng = (name: string) =>
  (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, `../../public/${ name }`))
  }


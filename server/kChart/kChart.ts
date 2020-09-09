/**
 * Created by Jacob Xie on 9/9/2020.
 */

import { Request, Response } from "express"
import fs from "fs"
import exceljs from "exceljs"

// import { Rkx } from "./data"


export const readDir = (filepath: string) =>
  (req: Request, res: Response) =>
    res.send(fs.readdirSync(filepath))

const fileNameRkx = "rkx.csv"

const readRkxFromCsv = async (filepath: string) => {
  const wb = new exceljs.Workbook()
  const f = await wb.csv.readFile(filepath)

  const ans: any = []

  f.eachRow(row => {
    const rv = row.values as any[]
    if (rv.length > 1)
      ans.push(rv.slice(1))
  })

  return ans
}

export const readRkx = (root: string) =>
  async (req: Request, res: Response) => {
    const ticker = req.query.ticker as string

    const data = await readRkxFromCsv(`${ root }/${ ticker }/${ fileNameRkx }`)

    return res.status(200).send(data)
  }

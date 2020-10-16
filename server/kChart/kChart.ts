/**
 * Created by Jacob Xie on 9/9/2020.
 */

import { Request, Response } from "express"
import fs from "fs"
import Papa from "papaparse"

// import { Rkx } from "./data"


export const readDir = (filepath: string) =>
  (req: Request, res: Response) => {
    if (!fs.existsSync(filepath))
      res.status(400).send(`File: ${ filepath } not found!`)
    else
      res.send(fs.readdirSync(filepath))
  }

const fileNameRkx = "rkx.csv"
export const fileNameBi = "bi.csv"
export const fileNameDn = "duan.csv"

type LineDataType = "bi.csv" | "duan.csv"

export const readRkx = (root: string) =>
  (req: Request, res: Response) => {
    const ticker = req.query.ticker as string

    const d = fs.readFileSync(`${ root }/${ ticker }/${ fileNameRkx }`).toString()

    Papa.parse(d, {
      delimiter: ",",
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => {
        res.status(200).send(results.data)
      }
    })
  }


const extractLine = (row: any[]) => {
  const startDate = row[2]
  const price = row[7]
  return [startDate, price]
}

export const readLine = (root: string, lineDataType: LineDataType) =>
  (req: Request, res: Response) => {
    const ticker = req.query.ticker as string

    const fp = `${ root }/${ ticker }/${ lineDataType }`
    if (!fs.existsSync(fp)) {
      res.status(400).send(`File: ${ fp } not found!`)
    } else {
      const d = fs.readFileSync(fp).toString()

      Papa.parse(d, {
        delimiter: ",",
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: results => {
          // @ts-ignore
          const ans = results.data.map(extractLine)
          res.status(200).send(ans)
        }
      })
    }
  }


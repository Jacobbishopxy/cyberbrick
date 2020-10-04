/**
 * Created by Jacob Xie on 10/3/2020.
 */

import { Request, Response } from "express"
import formidable from "formidable"
import exceljs from "exceljs"

interface Spreadsheet {
  name: string
  data: object[]
}

interface ReadXlsxOptions {
  multiSheets?: boolean
}

const recordXlsxRows = (book: Spreadsheet[], sheet: exceljs.Worksheet) => {
  const s: object[] = []

  sheet.eachRow({ includeEmpty: true }, row => {
    const rv = row.values as any[]
    if (rv.length > 1) s.push(rv.slice(1))
    else s.push(rv)
  })

  book.push({
    name: sheet.name,
    data: s
  })
}

const readFromXlsx = async (filepath: string, options: ReadXlsxOptions) => {
  const workbook = new exceljs.Workbook()
  const f = await workbook.xlsx.readFile(filepath)

  const book: Spreadsheet[] = []

  if (options.multiSheets)
    f.eachSheet(ws => recordXlsxRows(book, ws))
  else
    recordXlsxRows(book, f.getWorksheet(1))

  return book
}

export const extractXlsxFile = (req: Request, res: Response) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json(err)

    let options = {}
    const { multiSheets } = req.query
    if (multiSheets && multiSheets === "true")
      options = { ...options, multiSheets: true }
    if (files.xlsx_file) {
      const ans = await readFromXlsx(files.xlsx_file.path, options)
      return res.status(200).send(ans)
    }
    return res.status(500)
  })
}


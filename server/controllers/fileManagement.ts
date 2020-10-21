/**
 * Created by Jacob Xie on 10/3/2020.
 */

import { Request, Response } from "express"
import formidable from "formidable"
import exceljs, { CellValue } from "exceljs"

interface Spreadsheet {
  name: string
  data: object[]
}

interface ReadXlsxOptions {
  multiSheets?: boolean
  numberRounding?: number
}

const recordXlsxRows = (book: Spreadsheet[], sheet: exceljs.Worksheet, option?: ReadXlsxOptions) => {
  const s: object[] = []

  sheet.eachRow({ includeEmpty: true }, row => {
    let rv = row.values as CellValue[]
    if (option && option.numberRounding) {
      rv = rv.map((i: CellValue) =>
        typeof i === "number" ? +i.toFixed(option.numberRounding) : i
      )
    }

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
    f.eachSheet(ws => recordXlsxRows(book, ws, options))
  else
    recordXlsxRows(book, f.worksheets[0], options)

  return book
}

export const extractXlsxFile = (req: Request, res: Response) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json(err)

    let options = {}
    const { multiSheets, numberRounding } = req.query
    if (multiSheets && multiSheets === "true")
      options = { ...options, multiSheets: true }
    if (numberRounding)
      options = { ...options, numberRounding }

    if (files.xlsx_file) {
      const ans = await readFromXlsx(files.xlsx_file.path, options)
      return res.status(200).send(ans)
    }
    return res.status(500)
  })
}


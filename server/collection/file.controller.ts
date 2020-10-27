/**
 * Created by Jacob Xie on 10/3/2020.
 */

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Bind,
  Query,
  ParseBoolPipe,
  ParseIntPipe
} from '@nestjs/common'
import { FileInterceptor } from "@nestjs/platform-express"

import { Request, Response } from "express"
import formidable from "formidable"
import { Workbook, Worksheet } from 'exceljs'
import moment from 'moment'

interface Spreadsheet {
  name: string
  data: object[]
}

interface ReadXlsxOptions {
  multiSheets?: boolean
  numberRounding?: number
  dateFormat?: string
}

const recordXlsxRows = (book: Spreadsheet[], sheet: Worksheet, option?: ReadXlsxOptions) => {
  const s: any[][] = []

  sheet.eachRow({ includeEmpty: true }, row => {
    const r: any[] = []
    row.eachCell({ includeEmpty: true }, (cell) => {
      switch (cell.type) {
        case 2:
          if (option && option.numberRounding && cell.value !== null)
            r.push(+(cell.value as number).toFixed(option.numberRounding))
          else
            r.push(cell.value)
          break
        case 4:
          if (option && option.dateFormat)
            r.push(moment(cell.value as string).format(option.dateFormat))
          else
            r.push(cell.value)
          break
        default:
          r.push(cell.value)
      }
    })
    s.push(r)
  })

  book.push({
    name: sheet.name,
    data: s
  })
}

const readFromXlsx = async (filepath: string, options: ReadXlsxOptions) => {
  const workbook = new Workbook()
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
    const { multiSheets, numberRounding, dateFormat } = req.query
    if (multiSheets && multiSheets === "true")
      options = { ...options, multiSheets: true }
    if (numberRounding)
      options = { ...options, numberRounding }
    if (dateFormat)
      options = { ...options, dateFormat }

    if (files.xlsx_file) {
      const ans = await readFromXlsx(files.xlsx_file.path, options)
      return res.status(200).send(ans)
    }
    return res.status(500)
  })
}

@Controller()
export class FileController {

  private readFromXlsx = async (file: Buffer, options: ReadXlsxOptions) => {
    const workbook = new Workbook()
    const f = await workbook.xlsx.load(file)

    const book: Spreadsheet[] = []

    if (options.multiSheets)
      f.eachSheet(ws => recordXlsxRows(book, ws, options))
    else
      recordXlsxRows(book, f.worksheets[0], options)

    return book
  }

  @Post('extractXlsxFile')
  @UseInterceptors(FileInterceptor('xlsx'))
  @Bind(UploadedFile())
  async extractXlsxFile(file: Express.Multer.File,
                        @Query('multiSheets', ParseBoolPipe) multiSheets: boolean,
                        @Query('numberRounding', ParseIntPipe) numberRounding: number,
                        @Query('dateFormat') dateFormat: string) {


    let options = {}
    if (multiSheets)
      options = { ...options, multiSheets: true }
    if (numberRounding)
      options = { ...options, numberRounding }
    if (dateFormat)
      options = { ...options, dateFormat }

    return this.readFromXlsx(file.buffer, options)
  }

}

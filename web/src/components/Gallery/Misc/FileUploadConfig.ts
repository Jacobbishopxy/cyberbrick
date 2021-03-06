/**
 * Created by Jacob Xie on 11/19/2020
 */

import axios, {AxiosResponse} from "axios"

export const fileExtractUrl = "/api/upload/extract"
export const fileInsertUrl = "/api/database/insertByFile"


export interface FileExtractOption extends Record<string, any> {
  fileOptions?: string[]
  numberRounding?: number
  dateFormat?: string
  transpose?: boolean
}

export const fileExtract = (option: FileExtractOption, data: any): Promise<AxiosResponse> => {
  let u = `${fileExtractUrl}?`
  u += `multiSheets=${option.fileOptions?.includes("multiSheets") || false}&`
  if (option.numberRounding) u += `numberRounding=${option.numberRounding}&`
  if (option.dateFormat) u += `dateFormat=${option.dateFormat}&`
  if (option.transpose) u += `transpose=${option.transpose}&`

  return axios.post(u, data)
}

export interface FileInsertOption extends Record<string, any> {
  id?: string
  tableName?: string
  insertOption?: string
  transpose?: boolean
  sheetPrefix?: string
}

export const fileInsert = (option: FileInsertOption, data: any): Promise<AxiosResponse> => {
  let u = `${fileInsertUrl}?id=${option.id}&tableName=${option.tableName}&`
  if (option.insertOption) u += `insertOption=${option.insertOption}&`
  if (option.transpose) u += `transpose=${option.transpose}&`
  if (option.sheetPrefix) u += `sheetPrefix=${option.sheetPrefix}&`

  return axios.post(u, data)
}


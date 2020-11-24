/**
 * Created by Jacob Xie on 11/19/2020
 */

import axios, {AxiosResponse} from "axios"

const fileExtractUrl = "/api/upload/extract"
const fileInsertUrl = "/api/database/insertByFile"


export interface FileExtractOption extends Record<string, any> {
  fileOptions?: string[]
  numberRounding?: number
  dateFormat?: string
}

export const fileExtract = (option: FileExtractOption, data: any): Promise<AxiosResponse> => {
  let u = `${fileExtractUrl}?`
  u += `multiSheets=${option.fileOptions?.includes("multiSheets") || false}&`
  if (option.numberRounding) u += `numberRounding=${option.numberRounding}&`
  if (option.dateFormat) u += `dateFormat=${option.dateFormat}&`

  return axios.post(u, data)
}

export interface FileInsertOption extends Record<string, any> {
  id?: string
  tableName?: string
  insertOption?: string
}

export const fileInsert = (option: FileInsertOption, data: any): Promise<AxiosResponse> => {
  let u = `${fileInsertUrl}?id=${option.id}&tableName=${option.tableName}&`
  if (option.insertOption) u += `insertOption=${option.insertOption}`

  return axios.post(u, data)
}

// todo: replacement
export class FileUploadConfig {
  url: string

  constructor(url: string) {
    this.url = url
  }

  fileExtract(option: FileExtractOption, data: any): Promise<AxiosResponse> {
    let u = `${this.url}?`
    u += `multiSheets=${option.fileOptions?.includes("multiSheets") || false}&`
    if (option.numberRounding) u += `numberRounding=${option.numberRounding}&`
    if (option.dateFormat) u += `dateFormat=${option.dateFormat}&`

    return axios.post(u, data)
  }

  fileInsert(option: FileInsertOption, data: any): Promise<AxiosResponse> {
    let u = `${this.url}?id=${option.id}&tableName=${option.tableName}&`
    if (option.insertOption) u += `insertOption=${option.insertOption}`

    return axios.post(u, data)
  }
}


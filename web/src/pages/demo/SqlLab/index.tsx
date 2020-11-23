/**
 * Created by Jacob Xie on 11/18/2020
 */

import React from 'react'
import {Dataset} from "@/components/Gallery/Dataset"
import {devData} from "./devData"


const dbList = [
  {
    name: "dev 0",
    id: "1"
  },
  {
    name: "dev 1",
    id: "2"
  }
]

export default () => {

  const onSelectDatabase = (db: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["table 1", "table 2"])
      }, 1000)
    })
  }

  const onSelectTable = (tb: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(devData)
      }, 1000)
    })
  }

  const onExecute = (sqlStr: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(devData)
      }, 1000)
    })
  }

  const fileInsert = (option: any, data: any): Promise<any> =>
    Promise.reject()

  return (
    <Dataset
      rowKey="S_INFO_WINDCODE"
      storages={dbList}
      storageOnSelect={onSelectDatabase}
      tableOnSelect={onSelectTable}
      sqlOnExecute={onExecute}
      fileOnUpload={fileInsert}
    />
  )
}


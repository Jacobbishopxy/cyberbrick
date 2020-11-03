/**
 * Created by Jacob Xie on 9/10/2020.
 */

import React from 'react'
import {Controller} from "@/components/Gallery/Overview/OverviewController/Controller"

import * as DataType from "@/components/Gallery/GalleryDataType"

const categoryNames = [
  "DevOps",
  "Language"
]

const marks: DataType.Mark[] = [
  {
    id: "1",
    name: "000001.SZ"
  },
  {
    id: "2",
    name: "600000.SH"
  }
]

const categoryOnSelect = (cn: string): Promise<DataType.Mark[]> =>
  new Promise<DataType.Mark[]>((rs, rj) => {
    setTimeout(() => rs(marks), 500)
  })

export default () => {

  return (
    <>
      <Controller
        categoryNames={categoryNames}
        categoryOnSelect={categoryOnSelect}
        markOnSelect={e => console.log(e)}
        onEdit={e => console.log(e)}
      />
    </>
  )
}


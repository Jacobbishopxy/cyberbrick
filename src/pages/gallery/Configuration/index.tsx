/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React from 'react'

import { CategoryTable } from "@/components/Gallery/ConfigPage/ConfigTable"
import * as DataType from "@/components/Gallery/DataType"

const data: DataType.Category[] = [
  {
    name: "DevOps",
    description: "development",
    dashboard: {
      name: "DevOps"
    },
    marks: [
      {
        id: "1",
        name: "000001.SZ",
        color: "volcano"
      }
    ],
    tags: [
      {
        id: "1",
        name: "Bank",
        color: "magenta"
      },
      {
        id: "2",
        name: "File",
        color: "lime"
      },
    ]
  },
  {
    name: "Language",
    description: "development",
    marks: [],
    tags: []
  }
]

export default () => {

  return (
    <>
      <CategoryTable data={ data }/>
    </>
  )
}


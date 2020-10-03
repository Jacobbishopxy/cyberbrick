/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React from 'react'

import * as DataType from "@/components/Gallery/DataType"
import { CategoryConfigTable } from "@/components/Gallery/ConfigPage/CategoryConfigTable"
import { DashboardConfigTable } from "@/components/Gallery/ConfigPage/DashboardConfigTable"
import { Divider } from "antd"

const dataCategory: DataType.Category[] = [
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
  },

  {
    name: "Datasource",
    description: "",
    marks: [],
    tags: []
  }
]

const dataDashboard: DataType.Dashboard[] = [
  {
    name: "DevOps",
    description: "Mock",
    templates: [
      {
        name: "Language",
      },
      {
        name: "Development"
      }
    ]
  },
  {
    name: "Prod",
    description: "fake prod",
    templates: [
      {
        name: "Workflow",
      }
    ]
  },
]

const testAPI = (name: string, content?: any) =>
  console.log(name, content)

export default () => {

  return (
    <>
      <CategoryConfigTable
        data={ dataCategory }
        newCategory={ testAPI }
        modifyCategoryDescription={ testAPI }
        modifyDashboardDescription={ testAPI }
        saveMark={ testAPI }
        deleteMark={ testAPI }
        saveTag={ testAPI }
        deleteTag={ testAPI }
        newDashboard={ testAPI }
      />
      <Divider/>
      <DashboardConfigTable
        data={ dataDashboard }
        saveTemplate={ testAPI }
        deleteTemplate={ testAPI }
      />
    </>
  )
}


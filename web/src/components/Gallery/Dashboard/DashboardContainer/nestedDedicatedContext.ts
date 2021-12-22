import React from 'react'
import * as DataType from "@/components/Gallery/GalleryDataType"

//DashboardContext上下文类型，快速传递属性。
export interface nestedDedicatedContextProps {
  setSubmoduleDateList?: React.Dispatch<React.SetStateAction<string[]>>
  isNested: boolean | undefined
  setContent: React.Dispatch<React.SetStateAction<DataType.Content | undefined>> | undefined
  content: DataType.Content | undefined
  parentInfo?: {
    selectedCategoryName: string,
    dashboardInfo: DataType.Dashboard
    templateInfo: DataType.Template

  }
  elements: DataType.Element[] | undefined
  setElements: React.Dispatch<React.SetStateAction<DataType.Element[]>> | undefined
  dateList: string[]
  setDateList: React.Dispatch<React.SetStateAction<string[]>>
  elementName: string
  // nested当前所选的模块名字
  currentModuleName: string | undefined
  setCurrentModuleName: React.Dispatch<React.SetStateAction<string>> | undefined
  // 该模块的信息
  element: DataType.Element,
  setElement: React.Dispatch<React.SetStateAction<DataType.Element>>
  // 右上角的编辑
  editable: boolean | undefined

  datesMapContentIds: DataType.Content[] | undefined
}


export const nestedDedicatedContext = React.createContext<nestedDedicatedContextProps | undefined>(undefined)


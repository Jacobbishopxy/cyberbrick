import React from 'react'
import * as DataType from "../GalleryDataType"

//DashboardContext上下文类型，快速传递属性。
export interface DashboardContextType {
    fetchElementContent?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    saveTemplate?:(template: DataType.Template) => Promise<void>
    updateElements?:(ele:DataType.Element[])=>any
    setdashboardInfoInNewestContent?:(content:DataType.Content)=>void

    allContent?:DataType.Content[]
    setUpdatedContents?:React.Dispatch<React.SetStateAction<DataType.Content[]>>
}


export const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined)


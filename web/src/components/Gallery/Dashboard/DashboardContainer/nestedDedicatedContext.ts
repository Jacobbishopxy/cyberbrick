import React from 'react'
import * as DataType from "@/components/Gallery/GalleryDataType"

//DashboardContext上下文类型，快速传递属性。
export interface nestedDedicatedContextProps {
    setSubmoduleDateList?:React.Dispatch<React.SetStateAction<string[]>>
    isNested:boolean|undefined
    setContent:React.Dispatch<React.SetStateAction<DataType.Content|undefined>>|undefined
    content:DataType.Content|undefined
    parentInfo?: {
        selectedCategoryName: string,
        dashboardInfo: DataType.Dashboard
        templateInfo: DataType.Template
        
    }
    elements:DataType.Element[] | undefined
    setElements: React.Dispatch<React.SetStateAction<DataType.Element[]>>|undefined
}


export const nestedDedicatedContext = React.createContext<nestedDedicatedContextProps | undefined>(undefined)


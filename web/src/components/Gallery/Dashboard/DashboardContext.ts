import React from 'react'
import * as DataType from "../GalleryDataType"

//DashboardContext上下文类型，快速传递属性。
export interface DashboardContextType {
    //获取content
    fetchElementContent?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    //保存维度
    saveTemplate?:(template: DataType.Template) => Promise<void>
    //保存模块s
    updateElements?:(ele:DataType.Element[])=>any
    //在更新NewestContent前加入公司信息
    setDashboardInfoInNewestContent?:(content:DataType.Content)=>void 
    //最外层的contents
    allContent?:DataType.Content[]
    //最外层的contents的set
    setAllContent?:React.Dispatch<React.SetStateAction<DataType.Content[]|undefined>>
    //最外层contents的暂存值的set
    // setNewestContent?:React.Dispatch<React.SetStateAction<DataType.Content>>
}


export const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined)


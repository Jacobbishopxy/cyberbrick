import React from 'react'
import * as DataType from "../GalleryDataType"

//Dashboard上下文类型，快速传递属性。
export interface DashboardContextType {
    fetchElementContent: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
}

export const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined)


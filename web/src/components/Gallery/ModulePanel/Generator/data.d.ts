/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from "react"

import * as DataType from "../../GalleryDataType"
import {tabItem} from '../Collections/NestedModule/data'

//模板编辑时内容props
export interface ModuleEditorField {
  content?: DataType.Content
  fetchStorages?: () => Promise<DataType.StorageSimple[]>
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  fetchTableList?: (id: string) => Promise<string[]>
  fetchTableColumns?: (storageId: string, tableName: string) => Promise<string[]>
  contentHeight?: number
  updateContent?: (c: DataType.Content) => void
  styling?: string

  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
  setContent?:React.Dispatch<React.SetStateAction<DataType.Content|undefined>>
  parentInfo?:any
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) =>boolean
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
}

//模板内容props
export interface ModulePresenterField {
  editable: boolean
  initialValue: string
  onSave:(v: string) => void
  content?: DataType.Content
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  styling?: string
  updateContent?: (c: DataType.Content) => void
  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
  setContent?:React.Dispatch<React.SetStateAction<DataType.Content|undefined>>
  parentInfo:any
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) =>boolean
}

export interface ConvertFwRef {
  edit: (value: boolean) => void
  items:()=>tabItem[]
}

export interface ConvertRefProps {
    editable: boolean
    initialValue: string
    onSave:(v:string)=>void
  content?: DataType.Content
  fetchStorages?: () => Promise<DataType.StorageSimple[]>
  fetchTableList?: (id: string) => Promise<string[]>
  fetchTableColumns?: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  updateContent?: (c: DataType.Content) => void
  styling?: string
  forwardedRef: React.Ref<ConvertFwRef>

  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
  setContent?:React.Dispatch<React.SetStateAction<DataType.Content|undefined>>
  parentInfo:object
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) =>boolean
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
}

export interface ConvertProps {
    editable: boolean
    initialValue: string
    onSave:(v:string)=>void
  content?: DataType.Content
  fetchStorages?: () => Promise<DataType.StorageSimple[]>
  fetchTableList?: (id: string) => Promise<string[]>
  fetchTableColumns?: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  updateContent?: (c: DataType.Content) => void
  styling?: string

  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
  setContent?:React.Dispatch<React.SetStateAction<DataType.Content|undefined>>
  parentInfo?:object
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) =>boolean
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
}

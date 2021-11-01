/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from "react"

import * as DataType from "../../GalleryDataType"
import {tabItem} from '../Collections/NestedModule/data'
//模板编辑时内容type
export interface ModuleEditorField {
  content?: DataType.Content
  fetchStorages?: () => Promise<DataType.StorageSimple[]>
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  fetchTableList?: (id: string) => Promise<string[]>
  fetchTableColumns?: (storageId: string, tableName: string) => Promise<string[]>
  contentHeight?: number
  updateContent: (c: DataType.Content) => void
  styling?: string

  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
}

//模板内容type
export interface ModulePresenterField {
    editable: boolean
    initialValue: string
  onSave:(v: string) => void
  content?: DataType.Content
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  styling?: string
  updateContent: (c: DataType.Content) => void
  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
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
  updateContent: (c: DataType.Content) => void
  styling?: string
  forwardedRef: React.Ref<ConvertFwRef>

  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
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
  updateContent: (c: DataType.Content) => void
  styling?: string

  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
}


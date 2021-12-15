// import { today } from "@/components/Gallery/GalleryDataType"
// import { ModuleEditorField, ModulePresenterField } from "@/components/Gallery/ModulePanel/Generator/data"
// import { ModuleGenerator } from "@/components/Gallery/ModulePanel/Generator/ModuleGenerator"
import { useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { NestedModuleEditor } from "./Editor"
import './style.less'
import { NSMid } from "./util"

// 重构
import * as DataType from "@/components/Gallery/GalleryDataType"
export interface NestedModuleProps {
  editable: boolean
  initialValue: string
  onSave: (v: string) => void
  content?: DataType.Content
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  styling?: string
  updateContent?: (c: DataType.Content) => void
  fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
  setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  parentInfo: any
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
  addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => boolean
  //获取全部数据库
  fetchStorages: () => Promise<DataType.StorageSimple[]>
  fetchTableList: (id: string) => Promise<string[]>
  fetchTableColumns: (storageId: string, tableName: string) => Promise<string[]>
}

export interface NestedModuleRef {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
}

export const NestedModule = forwardRef((props: NestedModuleProps, ref: React.Ref<NestedModuleRef>) => {
  const [edit, setEdit] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      setEdit
    }
  })
  console.log(215, props.contentHeight)
  return (
    <NestedModuleEditor
      content={props.content}
      setContent={props.setContent}
      setNewestContent={props.setNewestContent}
      // currIndex={currIndex}
      // setCurrIndex={setCurrIndex}
      // setItems={setItems}
      editable={edit}
      setEdit={setEdit}
      NSMid={NSMid}
      contentHeight={props.contentHeight}
      fetchStoragesFn={props.fetchStorages}
      fetchTableColumnsFn={props.fetchTableColumns}
      fetchTableListFn={props.fetchTableList}
      fetchQueryDataFn={props.fetchQueryData}
      // updateContentFn={props.updateContent}
      // setSaveCount={setSaveCount}

      fetchContentFn={props.fetchContentFn!}
      fetchContentDatesFn={props.fetchContentDatesFn!}
      parentInfo={props.parentInfo}
      addElement={props.addElement!}
    />
  )
})
/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useContext } from "react"

import * as DataType from "../../GalleryDataType"
import { ConvertFwRef } from "../Generator/data"
import { XlsxTable } from "./table/XlsxTable"
import { FlexTable } from "./table/FlexTable"
import { EmbedLink } from "./miscellaneous/EmbedLink"
import { Text } from "./multiMedia/Text"
import { TargetPrice } from "./miscellaneous/TargetPrice"
import { FileView } from "./file/FileView"
import {
  Line,
  Bar,
  LineBar,
  Scatter,
  LineScatter,
  Pie,
  ConsensusDistribution
} from "./graph"

import { NestedModule } from "./NestedModule/NestedModule"
import { FieldHeader } from "./miscellaneous/FieldSeparator"
import { Excel } from './table/Excel'

export interface ModuleSelectorProps {

  parentInfo: object
  fetchStorages?: () => Promise<DataType.StorageSimple[]>
  fetchTableList?: (id: string) => Promise<string[]>
  fetchTableColumns?: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  // updateContent: (c: DataType.Content) => void
  forwardedRef: React.Ref<ConvertFwRef>
  // styling: string
  fetchContentFn: (id: string, date?: string) => Promise<DataType.Content | undefined>
  fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>

  // 总编辑
  editable: boolean
  // element编辑
  elementEdit: boolean | undefined
  initialValue: string
  onSave: (v: string) => void
  content?: DataType.Content
  setContent: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
  //submodule专用，set最外层contents的暂存之前写入子模块信息
  setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
  addElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => boolean
}

export const collectionSelector = (moduleType: DataType.ElementType): React.FC<ModuleSelectorProps> =>
  (props: ModuleSelectorProps) => {

    const defaultModule = <EmbedLink
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      setContent={props.setContent}
      contentHeight={props.contentHeight}
      // updateContent={props.updateContent}
      // styling={props.styling}
      ref={props.forwardedRef}
    />

    // 文章
    const text = <Text
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      fetchQueryData={props.fetchQueryData}
      // styling={props.styling}
      ref={props.forwardedRef}
    />

    // excel
    const xlsxTable = <XlsxTable
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // styling={props.styling}
      ref={props.forwardedRef}
    />
    // 数据集表格
    const flexTable = <FlexTable
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />
    //目标价
    const targetPrice = <TargetPrice

      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />
    // 文件管理
    const fileView = <FileView
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />

    // 折线图
    const line = <Line
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />

    const bar = <Bar
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />

    const lineBar = <LineBar
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />

    const scatter = <Scatter
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />

    const lineScatter = <LineScatter
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />

    const pie = <Pie
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />
    console.log(201, props, props.contentHeight)
    //嵌套模块
    const nestedModule = <NestedModule
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      setContent={props.setContent}
      setNewestContent={props.setNewestContent}

      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      // // styling={props.styling}
      ref={props.forwardedRef}

      fetchContentFn={props.fetchContentFn}
      fetchContentDatesFn={props.fetchContentDatesFn}
      parentInfo={props.parentInfo}
      addElement={props.addElement}
    />

    const fieldHeader = <FieldHeader
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />

    const consensusDistribution = <ConsensusDistribution
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      ref={props.forwardedRef}
    />

    console.log(270, props.elementEdit)
    const excel = <Excel
      onSave={props.onSave}
      initialValue={props.initialValue}
      editable={props.editable}
      content={props.content}
      contentHeight={props.contentHeight}
      setContent={props.setContent}
      // // styling={props.styling}
      elementEdit={props.elementEdit}
      ref={props.forwardedRef}></Excel>
    switch (moduleType) {
      case DataType.ElementType.EmbedLink:
        return defaultModule
      case DataType.ElementType.Text:
        return text
      case DataType.ElementType.XlsxTable:
        return xlsxTable
      case DataType.ElementType.FlexTable:
        return flexTable
      case DataType.ElementType.TargetPrice:
        return targetPrice
      case DataType.ElementType.FileManager:
        return fileView
      case DataType.ElementType.Line:
        return line
      case DataType.ElementType.Bar:
        return bar
      case DataType.ElementType.LineBar:
        return lineBar
      case DataType.ElementType.Scatter:
        return scatter
      case DataType.ElementType.LineScatter:
        return lineScatter
      case DataType.ElementType.Pie:
        return pie
      case DataType.ElementType.NestedModule:
        return nestedModule
      case DataType.ElementType.FieldHeader:
        return fieldHeader
      case DataType.ElementType.ConsensusDistribution:
        return consensusDistribution
      case DataType.ElementType.Excel:
        return excel
      default:
        return defaultModule
    }
  }


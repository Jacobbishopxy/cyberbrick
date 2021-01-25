/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from 'react'

import * as DataType from "../../GalleryDataType"
import {ConvertFwRef} from "../Generator/data"
import {XlsxTable} from "./table/XlsxTable"
import {FlexTable} from "./table/FlexTable"
import {EmbedLink} from "./miscellaneous/EmbedLink"
import {Text} from "./miscellaneous/Text"
import {TargetPrice} from "./miscellaneous/TargetPrice"
import {FileView} from "./file/FileView"
import {
  Line,
  Bar,
  LineBar,
  Scatter,
  LineScatter
} from "./graph"

import styles from "../Panel/Common.less"


export interface ModuleSelectorProps {
  content?: DataType.Content
  fetchStorages?: () => Promise<DataType.StorageSimple[]>
  fetchTableList?: (id: string) => Promise<string[]>
  fetchTableColumns?: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  updateContent: (c: DataType.Content) => void
  forwardedRef: React.Ref<ConvertFwRef>
}

export const collectionSelector = (moduleType: DataType.ElementType): React.FC<ModuleSelectorProps> =>
  (props: ModuleSelectorProps) => {

    const defaultModule = <EmbedLink
      content={props.content}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const text = <Text
      content={props.content}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const xlsxTable = <XlsxTable
      content={props.content}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const flexTable = <FlexTable
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const targetPrice = <TargetPrice
      content={props.content}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const fileView = <FileView
      content={props.content}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const line = <Line
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const bar = <Bar
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const lineBar = <LineBar
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    // const pie = <Pie
    //   content={props.content}
    //   fetchStorages={props.fetchStorages}
    //   fetchTableList={props.fetchTableList}
    //   fetchTableColumns={props.fetchTableColumns}
    //   fetchQueryData={props.fetchQueryData}
    //   contentHeight={props.contentHeight}
    //   updateContent={props.updateContent}
    //   styling={styles.contentPanel}
    //   ref={props.forwardedRef}
    // />

    const scatter = <Scatter
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

    const lineScatter = <LineScatter
      content={props.content}
      fetchStorages={props.fetchStorages}
      fetchTableList={props.fetchTableList}
      fetchTableColumns={props.fetchTableColumns}
      fetchQueryData={props.fetchQueryData}
      contentHeight={props.contentHeight}
      updateContent={props.updateContent}
      styling={styles.contentPanel}
      ref={props.forwardedRef}
    />

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
      // case DataType.ElementType.Pie:
      //   return pie
      case DataType.ElementType.Scatter:
        return scatter
      case DataType.ElementType.LineScatter:
        return lineScatter
      default:
        return defaultModule
    }
  }


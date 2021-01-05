/**
 * Created by Jacob Xie on 11/25/2020
 */

import React from 'react'
import {GeneralTableEditorField} from "@/components/Gallery/ModulePanel/Collections/table/GeneralTableEditorField"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"


const initContent = {
  date: "2020",
  data: []
}

export default () => {

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple() as Promise<DataType.StorageSimple[]>

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (storageId: string, tableName: string) =>
    GalleryService.databaseGetTableColumns(storageId, tableName)

  return (
    <GeneralTableEditorField
      content={initContent}
      fetchStorages={fetchStorages}
      fetchTableList={fetchTableList}
      fetchTableColumns={fetchTableColumns}
      updateContent={c => console.log(c)}
    />
  )
}


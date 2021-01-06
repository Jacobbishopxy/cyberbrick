/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'
import {GeneralTableEditorField} from "@/components/Gallery/ModulePanel/Collections/table/GeneralTableEditorField"
import {PresenterField} from "@/components/Gallery/ModulePanel/Collections/table/FlexTable"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"


export default () => {

  const [dataSource, setDataSource] = useState<DataType.Content>()

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple() as Promise<DataType.StorageSimple[]>

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (storageId: string, tableName: string) =>
    GalleryService.databaseGetTableColumns(storageId, tableName)

  const fetchQueryData = (value: DataType.Content) => {
    const id = value.data.id
    const option = value.data as DataType.Read
    return GalleryService.read(id, option)
  }

  return (
    <>
      <GeneralTableEditorField
        content={dataSource}
        fetchStorages={fetchStorages}
        fetchTableList={fetchTableList}
        fetchTableColumns={fetchTableColumns}
        updateContent={c => setDataSource(c)}
      />
      <PresenterField
        content={dataSource}
        fetchQueryData={fetchQueryData}
      />
    </>

  )
}


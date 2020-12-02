/**
 * Created by Jacob Xie on 11/25/2020
 */

import React from 'react'

import {generateCommonEditorField} from "@/components/Gallery/ModulePanel/Collections/graph/Common"

import * as DataType from "@/components/Gallery/GalleryDataType"
import * as GalleryService from "@/services/gallery"


const CT = generateCommonEditorField(true)

export default () => {

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple()

  const fetchTableList = (id: string) =>
    GalleryService.databaseListTable(id)

  const fetchTableColumns = (sId: string, tn: string) =>
    GalleryService.databaseGetTableColumns(sId, tn)

  const updateContent = (c: DataType.Content) => {
    return Promise.reject()
  }

  return (
    <div style={{padding: 24}}>
      <CT
        content={undefined}
        fetchStorages={fetchStorages}
        fetchTableList={fetchTableList}
        fetchTableColumns={fetchTableColumns}
        contentHeight={500}
        updateContent={updateContent}
      />
    </div>
  )
}


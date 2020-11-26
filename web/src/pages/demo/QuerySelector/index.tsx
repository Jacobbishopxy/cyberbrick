/**
 * Created by Jacob Xie on 11/25/2020
 */

import React from 'react'

import {QuerySelector} from "@/components/Gallery/Dataset"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"


export default () => {

  const storageOnFetch = () =>
    GalleryService.getAllStorages() as Promise<DataType.StorageSimple[]>

  const storageOnSelect = (id: string) =>
    GalleryService.databaseListTable(id)

  const tableOnSelect = (id: string, name: string) =>
    GalleryService.databaseGetTableColumns(id, name)

  return (
    <div style={{padding: 24}}>
      <QuerySelector
        storagesOnFetch={storageOnFetch}
        storageOnSelect={storageOnSelect}
        tableOnSelect={tableOnSelect}
      />
    </div>
  )
}


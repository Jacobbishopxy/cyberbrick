/**
 * Created by Jacob Xie on 11/23/2020
 */

import React, {useEffect, useState} from 'react'

import {Dataset} from "@/components/Gallery/Dataset"
import {fileInsert} from "@/components/Gallery/Misc/FileUploadConfig"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"


export default () => {

  const [storages, setStorages] = useState<DataType.StorageSimple[]>([])
  const [selectedStorage, setSelectedStorage] = useState<string>()

  const fetchStorages = () =>
    GalleryService.getAllStorageSimple()

  useEffect(() => {
    fetchStorages()
      .then(res => {
        if (res) setStorages(res)
      })
      .catch()

  }, [])

  const storageOnSelect = (id: string) => {
    setSelectedStorage(id)
    return GalleryService.databaseListTable(id)
  }

  const tableOnSelect = (tableName: string) => {
    if (selectedStorage)
      return GalleryService.read(selectedStorage, {tableName})
    return Promise.reject()
  }

  const tableOnDelete = (tableName: string) => {
    if (selectedStorage)
      return GalleryService.databaseDropTable(selectedStorage, tableName)
    return Promise.reject()
  }

  const sqlOnExecute = (sql: string) => {
    if (selectedStorage)
      return GalleryService.executeSql(selectedStorage, sql)
    return Promise.reject()
  }

  return (
    <Dataset
      storages={storages}
      storageOnSelect={storageOnSelect}
      tableOnSelect={tableOnSelect}
      tableOnDelete={tableOnDelete}
      sqlOnExecute={sqlOnExecute}
      fileOnUpload={fileInsert}
    />
  )
}


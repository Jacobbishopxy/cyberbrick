/**
 * Created by Jacob Xie on 11/25/2020
 */

import React from 'react'
import {Button} from "antd"
import {PlusOutlined} from '@ant-design/icons'

import {QuerySelectorForm, QuerySelectorModal} from "@/components/Gallery/Dataset"
import * as GalleryService from "@/services/gallery"
import * as DataType from "@/components/Gallery/GalleryDataType"


export default () => {

  const storageOnFetch = () =>
    GalleryService.getAllStorageSimple() as Promise<DataType.StorageSimple[]>

  const storageOnSelect = (id: string) =>
    GalleryService.databaseListTable(id)

  const tableOnSelect = (id: string, name: string) =>
    GalleryService.databaseGetTableColumns(id, name)

  return (
    <div style={{padding: 24}}>
      <QuerySelectorModal
        trigger={
          <Button type="primary">
            <PlusOutlined/>
            Click
          </Button>
        }
        storagesOnFetch={storageOnFetch}
        storageOnSelect={storageOnSelect}
        tableOnSelect={tableOnSelect}
        onSubmit={async (value) => {
          console.log(value)
          return true
        }}
      />

      <QuerySelectorForm
        storagesOnFetch={storageOnFetch}
        storageOnSelect={storageOnSelect}
        tableOnSelect={tableOnSelect}
        onSubmit={async (value) => console.log(value)}
      />
    </div>
  )
}


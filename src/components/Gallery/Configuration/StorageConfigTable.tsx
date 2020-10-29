/**
 * Created by Jacob Xie on 10/28/2020.
 */

import React, { useState } from 'react'


import { Editor } from "@/components/Editor"
import * as DataType from "../GalleryDataType"
import { Table } from "antd"

export interface StorageConfigTableProps {
  data: DataType.Storage[]
  saveStorage: (storage: DataType.Storage) => void
  deleteStorage: (id: string) => void
}

// todo: API saveStorage, deleteStorage
export const StorageConfigTable = (props: StorageConfigTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)

  return (
    <div>
      <Table
        dataSource={props.data.map(i => ({...i, key: i.id}))}
        title={ () =>
          <div style={ { display: "flex", justifyContent: "space-between" } }>
            <span style={ { fontWeight: "bold" } }>Storage configuration</span>
            <Editor onChange={ setEditable }/>
          </div>
        }
        size="small"
        bordered
        pagination={ false }
      >
        <Table.Column
          title="ID"
          dataIndex="id"
          key="id"
        />
        <Table.Column
          title="Name"
          dataIndex="name"
          key="name"
        />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column
          title="Type"
          dataIndex="type"
          key="type"
        />
        <Table.Column
          title="Host"
          dataIndex="host"
          key="host"
        />
        <Table.Column
          title="Port"
          dataIndex="port"
          key="port"
        />
        <Table.Column
          title="Database"
          dataIndex="database"
          key="database"
        />
        <Table.Column
          title="Username"
          dataIndex="username"
          key="username"
        />
        <Table.Column
          title="Password"
          dataIndex="password"
          key="password"
        />
      </Table>
    </div>
  )
}


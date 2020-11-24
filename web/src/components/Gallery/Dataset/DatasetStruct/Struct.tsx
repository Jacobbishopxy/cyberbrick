/**
 * Created by Jacob Xie on 11/17/2020
 */

import React, {useEffect, useState} from 'react'
import {Card, Col, Row, Space} from "antd"

import {Header, Sider} from "../DatasetController"
import * as DataType from "../../GalleryDataType"


export interface StructProps {
  children: React.ReactElement
  storages: DataType.StorageSimple[]
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (tableName: string) => void
  tableOnDelete: (tableName: string) => void
  sqlOnExecute: (sql: string) => void
  fileOnUpload: (option: any, data: any) => Promise<any>
}

export const Struct = (props: StructProps) => {
  const [storageId, setStorageId] = useState<string>()
  const [tableList, setTableList] = useState<string[]>([])

  const getTableList = () => {
    if (storageId)
      props.storageOnSelect(storageId)
        .then(res => { if (res) setTableList(res) })
  }

  useEffect(getTableList, [storageId])

  const tableOnDelete = (tableName: string) => {
    props.tableOnDelete(tableName)
    getTableList()
  }

  return (
    <Card size="small" style={{minHeight: "85vh"}}>
      <Row>
        <Col span={4}>
          <Sider
            tableList={tableList}
            onTableSelect={props.tableOnSelect}
            onTableDelete={tableOnDelete}
          />
        </Col>

        <Col span={20}>
          <Space direction="vertical" style={{width: "100%"}}>
            <Header
              storages={props.storages}
              storageOnSelect={setStorageId}
              onExecute={props.sqlOnExecute}
              onUpload={props.fileOnUpload}
              onUploadFinished={getTableList}
            />
            {props.children}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}


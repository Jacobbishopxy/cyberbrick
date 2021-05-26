/**
 * Created by Jacob Xie on 11/17/2020
 */

import React, {useEffect, useState} from "react"
import {Card, Col, Row, Space} from "antd"

import {Header, Sider} from "../DatasetController"
import * as DataType from "../../GalleryDataType"


export interface StructProps {
  children: React.ReactElement
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnClick: (id: string, tableName: string) => Promise<any>
  tableOnRename: (id: string, tableName: string, replacement: string) => Promise<any>
  tableOnDelete: (id: string, tableName: string) => Promise<any>
  tableOnSelect: (id: string, tableName: string) => Promise<string[]>
  querySelectorOnSubmit: (id: string, value: Record<string, any>) => Promise<any>
  sqlOnExecute: (id: string, sql: string) => void
  uploadAddress?: String
  fileOnUpload: (option: any, data: any) => Promise<any>
}

export const Struct = (props: StructProps) => {
  const [storages, setStorages] = useState<DataType.StorageSimple[]>([])
  const [storageId, setStorageId] = useState<string>()
  const [tableList, setTableList] = useState<string[]>([])

  useEffect(() => {
    props.storagesOnFetch().then(res => {
      if (res) setStorages(res)
    })
  }, [])

  const storageOnSelect = () => {
    if (storageId) props.storageOnSelect(storageId).then(res => {
      if (res) setTableList(res)
    })
  }

  useEffect(storageOnSelect, [storageId])

  const tableOnClick = (tableName: string) => {
    if (storageId) return props.tableOnClick(storageId, tableName)
    return Promise.reject()
  }

  const tableOnSelect = (tableName: string) => {
    if (storageId) return props.tableOnSelect(storageId, tableName)
    return Promise.reject()
  }

  const tableOnDelete = (tableName: string) => {
    if (storageId) return props.tableOnDelete(storageId, tableName).then(storageOnSelect)
    return Promise.reject()
  }

  const tableOnRename = (tableName: string, replacement: string) => {
    if (storageId) return props.tableOnRename(storageId, tableName, replacement).then(storageOnSelect)
    return Promise.reject()
  }

  const querySelectorOnSubmit = (value: Record<string, any>) => {
    if (storageId) return props.querySelectorOnSubmit(storageId, value).then(() => true).catch(() => false)
    return Promise.reject()
  }

  const sqlOnExecute = (sql: string) => {
    if (storageId) return props.sqlOnExecute(storageId, sql)
    return Promise.reject()
  }

  return (
    <Card size="small" style={{minHeight: "90vh"}}>
      <Row>
        <Col span={4}>
          <Sider
            id={storageId}
            tableList={tableList}
            storagesOnFetch={props.storagesOnFetch}
            storageOnSelect={props.storageOnSelect}
            tableOnClick={tableOnClick}
            tableOnSelect={tableOnSelect}
            tableOnRename={tableOnRename}
            tableOnDelete={tableOnDelete}
            onSubmit={querySelectorOnSubmit}
          />
        </Col>

        <Col span={20}>
          <Space direction="vertical" style={{width: "100%"}}>
            <Header
              storages={storages}
              storageOnSelect={setStorageId}
              onExecute={sqlOnExecute}
              uploadAddress={props.uploadAddress}
              onUpload={props.fileOnUpload}
              onUploadFinished={storageOnSelect}
            />
            {props.children}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}


/**
 * Created by Jacob Xie on 11/17/2020
 */

import React, {useState} from 'react'
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
  const [tableList, setTableList] = useState<string[]>([])

  const getTableList = async (id: string) => {
    const tl = await props.storageOnSelect(id)
    if (tl) setTableList(tl)
  }

  return (
    <Card size="small">
      <Row>
        <Col span={4}>
          <Sider
            tableList={tableList}
            onTableSelect={props.tableOnSelect}
            onTableDelete={props.tableOnDelete}
          />
        </Col>

        <Col span={20}>
          <Space direction="vertical" style={{width: "100%"}}>
            <Header
              storages={props.storages}
              storageOnSelect={getTableList}
              onExecute={props.sqlOnExecute}
              onUpload={props.fileOnUpload}
            />
            <div style={{overflowX: "scroll"}}>
              {props.children}
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}


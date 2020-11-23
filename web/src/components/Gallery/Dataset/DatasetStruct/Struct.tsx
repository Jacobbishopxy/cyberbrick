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
  sqlOnExecute: (sql: string) => void
  fileOnUpload: (option: any, data: any) => Promise<any>
}

export const Struct = (props: StructProps) => {
  const [tableList, setTableList] = useState<string[]>([])

  const storageOnSelect = async (id: string) => {
    const tl = await props.storageOnSelect(id)
    if (tl) setTableList(tl)
  }

  return (
    <Card size="small">
      <Row>
        <Col span={3}>
          <Sider
            tableList={tableList}
            onTableSelect={props.tableOnSelect}
          />
        </Col>

        <Col span={21}>
          <Space direction="vertical" style={{width: "100%"}}>
            <Header
              storages={props.storages}
              storageOnSelect={storageOnSelect}
              onExecute={props.sqlOnExecute}
              onUpload={props.fileOnUpload}
            />
            {props.children}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}


/**
 * Created by Jacob Xie on 11/20/2020
 */

import React, {useState} from 'react'
import {Button, Input, Select, Space, Tooltip} from "antd"
import {CaretRightOutlined, MinusOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons"

import {EditorButton} from "@/components/Editor"
import {SpaceBetween} from "@/components/SpaceBetween"
import * as DataType from "../../GalleryDataType"
import {FileInsertModal} from "@/components/FileUploadModal"


const QueryViewer = (props: { onClick: (value: boolean) => void }) =>
  <EditorButton
    icons={{open: <PlusOutlined/>, close: <MinusOutlined/>}}
    name={{open: "Execution", close: "Close"}}
    size="small"
    onChange={props.onClick}
  />

interface QueryFieldProps {
  queryVisible: boolean
  onExecute: (sql: string) => void
}

const QueryField = (props: QueryFieldProps) => {
  const [sqlStr, setSqlStr] = useState<string>()

  const onExecute = () => {
    if (sqlStr) props.onExecute(sqlStr)
  }

  return props.queryVisible ?
    <Space direction="vertical" style={{width: "100%"}}>
      <Input.TextArea
        rows={10}
        allowClear
        onChange={e => setSqlStr(e.target.value)}
      />
      <Tooltip title="Execute">
        <Button type="primary" icon={<CaretRightOutlined/>} onClick={onExecute}>
          Execute
        </Button>
      </Tooltip>
    </Space> : <></>
}


export interface HeaderProps {
  storages: DataType.StorageSimple[]
  storageOnSelect: (id: string) => void
  onExecute: (sql: string) => void
  onUpload: (option: any, data: any) => Promise<any>
}

export const Header = (props: HeaderProps) => {
  const [selectedDb, setSelectedDb] = useState<string>()
  const [queryVisible, setQueryVisible] = useState<boolean>(false)
  const [uploadVisible, setUploadVisible] = useState<boolean>(false)

  const onDatabaseSelect = (id: string) => {
    props.storageOnSelect(id)
    setSelectedDb(id)
  }


  return (
    <Space direction="vertical" style={{width: "100%"}}>
      <SpaceBetween>
        <Space>
          <span>DB: </span>
          <Select
            style={{width: 200}}
            onSelect={onDatabaseSelect}
            size="small"
            placeholder="Database"
          >
            {
              props.storages.map(s =>
                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
              )
            }
          </Select>
          {selectedDb ? <span>ID: {selectedDb}</span> : <></>}
        </Space>
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<UploadOutlined/>}
            disabled={!selectedDb}
            onClick={() => setUploadVisible(true)}
          >Upload</Button>
          <QueryViewer onClick={setQueryVisible}/>
        </Space>
      </SpaceBetween>

      <QueryField
        queryVisible={queryVisible}
        onExecute={props.onExecute}
      />

      <FileInsertModal
        idList={props.storages}
        setVisible={setUploadVisible}
        visible={uploadVisible}
        upload={props.onUpload}
        // uploadResHandle={() => {}}
      />
    </Space>
  )
}


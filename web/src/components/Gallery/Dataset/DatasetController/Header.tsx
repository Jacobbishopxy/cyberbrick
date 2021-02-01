/**
 * Created by Jacob Xie on 11/20/2020
 */

import React, {useState} from 'react'
import {Button, Select, Space} from "antd"
import {DownloadOutlined, ExclamationCircleOutlined, MinusCircleOutlined, UploadOutlined} from "@ant-design/icons"
import {FormattedMessage} from "umi"

import {Editor} from "@/components/Editor"
import {SpaceBetween} from "@/components/SpaceBetween"
import {FileInsertModal} from "@/components/FileUploadModal"
import * as DataType from "../../GalleryDataType"
import {QueryViewer, QueryField} from "./QueryField"


const IdViewer = (props: { visible: boolean, onClick: (value: boolean) => void }) =>
  props.visible ?
    <Editor
      icons={{open: <ExclamationCircleOutlined/>, close: <MinusCircleOutlined/>}}
      onChange={props.onClick}
    /> : <></>


export interface HeaderProps {
  storages: DataType.StorageSimple[]
  storageOnSelect: (id: string) => void
  onExecute: (sql: string) => void
  onUpload: (option: any, data: any) => Promise<any>
  onUploadFinished: () => void
}

export const Header = (props: HeaderProps) => {
  const [selectedDb, setSelectedDb] = useState<string>()
  const [idVisible, setIdVisible] = useState<boolean>(false)
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
          <span style={{fontWeight: "bold"}}>
            <FormattedMessage id="gallery.component.general19"/>
          </span>
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
          <div>
            <IdViewer visible={!!selectedDb} onClick={setIdVisible}/>
            {idVisible ? <span>ID: {selectedDb}</span> : <></>}
          </div>
        </Space>

        <Space>
          <Button
            type="primary"
            size="small"
            icon={<UploadOutlined/>}
            disabled={!selectedDb}
            onClick={() => setUploadVisible(true)}
          >
            <FormattedMessage id="gallery.component.general26"/>
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<DownloadOutlined/>}
            disabled
          >
            <FormattedMessage id="gallery.component.general27"/>
          </Button>
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
        uploadResHandle={props.onUploadFinished}
      />
    </Space>
  )
}


/**
 * Created by Jacob Xie on 11/18/2020
 */

import React, {useRef, useState} from 'react'
import {Card, Menu, Space, Button, Tooltip, Input, Select, Row, Col, Descriptions} from 'antd'
import ProTable, {ProColumns} from '@ant-design/pro-table'
import {CaretRightOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons"

import {Editor} from "@/components/Editor"
import {devData} from "./devData"
import {FileInsertModal} from "@/components/FileUploadModal"
import {fileInsert} from "@/components/Gallery/Misc/FileUploadConfig"


const genTableColumn = (data: Record<string, any>[]) => {
  if (data.length > 0) {
    return Object.keys(data[0]).map((k: string) => ({
      title: k,
      dataIndex: k,
    }))
  }
  return []
}

const QueryViewer = (props: { onClick: (value: boolean) => void }) =>
  <Editor
    icons={{open: <PlusOutlined/>, close: <MinusOutlined/>}}
    onChange={props.onClick}
  />

interface DbList {
  id: string
  name: string
}

interface StructProps {
  children: React.ReactElement
  databaseList: DbList[]
  onDatabaseSelect: (id: string) => Promise<string[]>
  onTableSelect: (value: string) => void
  onExecute: (sql: string) => void
  // onCreateNewTable: () => void
}

const Struct = (props: StructProps) => {
  const [sqlStr, setSqlStr] = useState<string>()
  const [selectedDb, setSelectedDb] = useState<string>()
  const [tableList, setTableList] = useState<string[]>([])
  const [queryVisible, setQueryVisible] = useState<boolean>(false)
  const [uploadVisible, setUploadVisible] = useState<boolean>(false)

  const onDatabaseSelect = async (id: string) => {
    const tl = await props.onDatabaseSelect(id)
    if (tl) {
      setSelectedDb(id)
      setTableList(tl)
    }
  }

  const onExecute = () => {
    if (sqlStr) props.onExecute(sqlStr)
  }

  return (
    <Card
      size="small"
    >
      <Row>
        <Col span={3}>
          <Space direction="vertical" style={{width: "100%"}}>
            <span style={{fontWeight: "bold"}}>Table list</span>
            <Menu
              onSelect={(e) => props.onTableSelect(e.key as string)}
              mode="inline"
            >
              {
                tableList.map(m => (
                  <Menu.Item key={m}>{m}</Menu.Item>
                ))
              }
            </Menu>
          </Space>
        </Col>

        <Col span={21}>
          <Space direction="vertical" style={{width: "100%"}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Space>
                <Select
                  style={{width: 200}}
                  onSelect={onDatabaseSelect}
                  size="small"
                  placeholder="Database"
                >
                  {
                    props.databaseList.map(s =>
                      <Select.Option key={s.id} value={s.id}>
                        <Descriptions column={2}>
                          <Descriptions.Item>DB: </Descriptions.Item>
                          <Descriptions.Item>{s.name}</Descriptions.Item>
                          <Descriptions.Item>ID: </Descriptions.Item>
                          <Descriptions.Item>{s.id}</Descriptions.Item>
                        </Descriptions>
                      </Select.Option>
                    )
                  }
                </Select>
              </Space>
              <Space>
                <Button
                  type="primary"
                  size="small"
                  disabled={!selectedDb}
                  onClick={() => setUploadVisible(true)}
                >Upload</Button>
                <QueryViewer onClick={setQueryVisible}/>
              </Space>
              <FileInsertModal
                idList={props.databaseList}
                setVisible={setUploadVisible}
                visible={uploadVisible}
                upload={fileInsert}
                uploadResHandle={() => {}}
              />
            </div>
            {
              queryVisible ?
                <>
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
                </> : <></>
            }
            {props.children}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}


interface SqlLabProps {
  rowKey: string
  databaseList: DbList[]
  onSelectDatabase: (db: string) => Promise<string[]>
  onSelectTable: (tb: string) => Promise<any[]>
  onExecuteSql: (sqlStr: string) => Promise<any[]>
}

interface ActionType {
  reload: (resetPageIndex?: boolean) => void
  fetchMore: () => void
  reset: () => void
}

const SqlLab = (props: SqlLabProps) => {

  const ref = useRef<ActionType>()

  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<ProColumns<any>[]>([{}])

  const onSelectTable = async (tb: string) => {
    const res = await props.onSelectTable(tb)
    if (res && ref.current) {
      setColumns(genTableColumn(res) as ProColumns<any>[])
      setData(res)
      ref.current.reload()
    }
  }

  const onExecuteSql = async (sqlStr: string) => {
    const res = await props.onExecuteSql(sqlStr)
    if (res && ref.current) {
      setColumns(genTableColumn(res) as ProColumns<any>[])
      setData(res)
      ref.current.reload()
    }
  }

  return (
    <ProTable
      actionRef={ref}
      columns={columns}
      rowKey={props.rowKey}
      pagination={{showSizeChanger: true}}
      tableRender={(_, dom) =>
        <Struct
          databaseList={props.databaseList}
          onDatabaseSelect={props.onSelectDatabase}
          onTableSelect={onSelectTable}
          onExecute={onExecuteSql}
        >
          {dom}
        </Struct>
      }
      params={{key: data}}
      request={async () => {
        const d = data.map(i => ({...i, key: i[props.rowKey]}))
        console.log(d)
        return {
          success: true,
          data: d,
        }
      }}
      search={false}
      dateFormatter="string"
      headerTitle="Result"
    />
  )
}

const dbList = [
  {
    name: "dev 0",
    id: "1"
  },
  {
    name: "dev 1",
    id: "2"
  }
]

export default () => {

  const onSelectDatabase = (db: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["table 1", "table 2"])
      }, 1000)
    })
  }

  const onSelectTable = (tb: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(devData)
      }, 1000)
    })
  }

  const onExecute = (sqlStr: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(devData)
      }, 1000)
    })
  }

  return (
    <SqlLab
      rowKey="S_INFO_WINDCODE"
      databaseList={dbList}
      onSelectDatabase={onSelectDatabase}
      onSelectTable={onSelectTable}
      onExecuteSql={onExecute}
    />
  )
}

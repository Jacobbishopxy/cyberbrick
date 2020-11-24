/**
 * Created by Jacob Xie on 11/20/2020
 */

import React from 'react'
import {Button, List, Modal, Space, Tooltip} from "antd"
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons"

import {SpaceBetween} from "@/components/SpaceBetween"


interface ListRenderProps {
  item: string
  onTableSelect: (table: string) => void
  onTableDelete: (table: string) => void
}

const showDeleteConfirm = (onOk: () => void) =>
  Modal.confirm({
    title: "Are you sure delete this table?",
    icon: <ExclamationCircleOutlined/>,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk,
  })

const ListRender = (props: ListRenderProps) => {

  const onDeleteClick = (item: string) => () => {
    showDeleteConfirm(() => props.onTableDelete(item))
  }

  return (
    <List.Item
      key={props.item}
    >
      <SpaceBetween style={{width: "100%"}}>
        <Button
          type="link"
          onClick={() => props.onTableSelect(props.item)}
        >
          <div style={{width: 150, overflow: "hidden", textOverflow: "ellipsis"}}>
            <Tooltip placement="topLeft" title={props.item}>
              {props.item}
            </Tooltip>
          </div>
        </Button>
        <Button
          type="link"
          danger
          icon={<DeleteOutlined/>}
          onClick={onDeleteClick(props.item)}
        />
      </SpaceBetween>
    </List.Item>
  )
}


export interface SiderProps {
  tableList: string[]
  onTableSelect: (table: string) => void
  onTableDelete: (table: string) => void
  style?: React.CSSProperties
}

export const Sider = (props: SiderProps) => {

  const renderItem = (item: string) =>
    <ListRender
      item={item}
      onTableSelect={props.onTableSelect}
      onTableDelete={props.onTableDelete}
    />

  return (
    <Space direction="vertical" style={{...props.style}}>
      <span style={{fontWeight: "bold"}}>Table list</span>
      {
        props.tableList.length !== 0 ?
          <List
            size="small"
            pagination={{
              size: "small",
              defaultPageSize: 15,
              showSizeChanger: true
            }}
            dataSource={props.tableList}
            renderItem={renderItem}
          /> : <></>
      }
    </Space>
  )
}


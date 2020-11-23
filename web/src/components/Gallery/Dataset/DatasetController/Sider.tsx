/**
 * Created by Jacob Xie on 11/20/2020
 */

import React from 'react'
import {Menu, Space} from "antd"

export interface SiderProps {
  tableList: string[]
  onTableSelect: (table: string) => void
}

export const Sider = (props: SiderProps) =>
  <Space direction="vertical" style={{width: "100%"}}>
    <span style={{fontWeight: "bold"}}>Table list</span>
    <Menu
      onSelect={(e) => props.onTableSelect(e.key as string)}
      mode="inline"
    >
      {props.tableList.map(m => (<Menu.Item key={m}>{m}</Menu.Item>))}
    </Menu>
  </Space>


/**
 * Created by Jacob Xie on 11/17/2020
 */

import React from 'react'
import {Button, List} from "antd"

export interface SiderProps {
  tables: string[]
  tableOnSelect: (table: string) => void
}

export const Sider = (props: SiderProps) => {

  return (
    <List
      dataSource={props.tables}
      renderItem={(table: string) => (
        <List.Item>
          <Button
            type="link"
            size="small"
            onClick={() => props.tableOnSelect(table)}
          >
            {table}
          </Button>
        </List.Item>
      )}
      size="small"
    />
  )
}


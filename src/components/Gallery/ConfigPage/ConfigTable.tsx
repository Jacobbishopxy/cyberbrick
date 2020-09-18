/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, { useState } from 'react'
import { Button, Space, Table } from "antd"
import { PlusOutlined } from '@ant-design/icons'

import * as DataType from "../DataType"
import { Editor } from "../Misc/Editor"
import { EditableTagPanel } from "../Tag/EditableTagPanel"


export interface CategoryTableProps {
  data: DataType.Category[]
}

export const CategoryTable = (props: CategoryTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)

  return (
    <div>
      <div style={ { display: "flex", justifyContent: "flex-end" } }>
        <Editor editable={ editable } setEditable={ setEditable }/>
      </div>
      <Table
        dataSource={ props.data.map(i => ({ ...i, key: i.name })) }
        size="small"
        bordered
      >
        <Table.ColumnGroup title="Category">
          <Table.Column
            title="Name"
            dataIndex="name"
            key="name"
          />
          <Table.Column
            title="Description"
            dataIndex="description"
            key="description"
          />
        </Table.ColumnGroup>
        <Table.ColumnGroup title="Dashboard">
          <Table.Column
            title="Name"
            dataIndex={ ["dashboard", "name"] }
            key="dashboardName"
            render={ (text: string) =>
              text === null ?
                <Button
                  icon={ <PlusOutlined/> }
                  type="primary"
                >
                  New Dashboard
                </Button> :
                text
            }
          />
          <Table.Column
            title="Description"
            dataIndex={ ["dashboard", "description"] }
            key="dashboardDescription"
          />
        </Table.ColumnGroup>
        <Table.Column
          title="Marks"
          dataIndex="marks"
          key="marks"
          render={ (marks: DataType.Mark[]) => {
            return <EditableTagPanel
              data={ marks }
              editable={ editable }  // todo: C/R/S
            />
          }

          }
        />
        <Table.Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={ (tags: DataType.Tag[]) =>
            <EditableTagPanel
              data={ tags }
              editable={ editable }  // todo: C/R/S
            />
          }
        />

        {
          editable ?
            <Table.Column
              title="Action"
              key="action"
              render={ (text: string, record: DataType.Category) => (  // todo: C/R/S
                <Space size="middle">
                  <a>Update</a>
                  <a style={ { color: "red" } }>Delete</a>
                </Space>
              ) }
            /> : <></>
        }
      </Table>
    </div>
  )
}


/**
 * Created by Jacob Xie on 10/3/2020.
 */

import React, { useState } from 'react'
import { Table } from "antd"

import * as DataType from "../GalleryDataType"
import { Editor } from "../Misc/Editor"
import { EditableTagPanel } from "../Tag/EditableTagPanel"


export interface DashboardConfigTableProps {
  data: DataType.Dashboard[]
  saveTemplate: (dashboardName: string, template: DataType.Template) => void
  deleteTemplate: (dashboardName: string, templateName: string) => void
}

/**
 * dealing with dashboard creating & modifying
 */
export const DashboardConfigTable = (props: DashboardConfigTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)

  const saveTemplate = (dashboardName: string) =>
    (template: DataType.Template) => props.saveTemplate(dashboardName, template)

  const deleteTemplate = (dashboardName: string) =>
    (templateName: string) => props.deleteTemplate(dashboardName, templateName)

  return (
    <div>
      <Table
        dataSource={ props.data.map(i => ({ ...i, key: i.name })) }
        title={ () =>
          <div style={ { display: "flex", justifyContent: "space-between" } }>
            <span style={ { fontWeight: "bold" } }>Dashboard configuration</span>
            <Editor editable={ editable } setEditable={ setEditable }/>
          </div>
        }
        size="small"
        bordered
        pagination={ false }
      >
        <Table.ColumnGroup title="Dashboard">
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
        <Table.Column
          title="Templates"
          dataIndex="templates"
          key="templates"
          render={ (templates: DataType.Template[], record: DataType.Dashboard) =>
            <EditableTagPanel
              data={ templates }
              editable={ editable }
              elementOnCreate={ saveTemplate(record.name) }
              elementOnRemove={ deleteTemplate(record.name) }
            />
          }
        />
      </Table>
    </div>
  )
}

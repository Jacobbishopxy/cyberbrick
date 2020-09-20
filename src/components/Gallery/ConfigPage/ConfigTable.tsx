/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, { useState } from 'react'
import { Table, Tag } from "antd"
import { PlusOutlined } from '@ant-design/icons'

import * as DataType from "../DataType"
import { Editor } from "../Misc/Editor"
import { CreationModal } from "../Misc/CreationModal"
import { EditableTagPanel } from "../Tag/EditableTagPanel"


export interface CategoryTableProps {
  data: DataType.Category[]
  saveMark: (categoryName: string, mark: DataType.Mark) => void
  deleteMark: (categoryName: string, mark: string) => void
  saveTag: (categoryName: string, tag: DataType.Tag) => void
  deleteTag: (categoryName: string, tag: string) => void
  newDashboard: (categoryName: string, dashboard: DataType.Dashboard) => void
}

export const CategoryTable = (props: CategoryTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)
  const [newDashboardVisible, setNewDashboardVisible] = useState<boolean>(false)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>()

  const saveMark = (categoryName: string) =>
    (mark: DataType.Mark) => props.saveMark(categoryName, mark)

  const deleteMark = (categoryName: string) =>
    (mark: string) => props.deleteMark(categoryName, mark)

  const saveTag = (categoryName: string) =>
    (tag: DataType.Tag) => props.saveTag(categoryName, tag)

  const deleteTag = (categoryName: string) =>
    (tag: string) => props.deleteTag(categoryName, tag)

  const newDashboard = (dashboard: DataType.Dashboard) => {
    if (selectedCategoryName)
      props.newDashboard(selectedCategoryName, dashboard)
    setNewDashboardVisible(false)
  }

  const openNewDashboardModal = (categoryName: string) => {
    setSelectedCategoryName(categoryName)
    setNewDashboardVisible(true)
  }


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
            render={ (text: string, record: DataType.Category) =>
              text === null && editable ?
                <Tag
                  icon={ <PlusOutlined/> }
                  onClick={ () => openNewDashboardModal(record.name) }
                >
                  New Dashboard
                </Tag> :
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
          render={ (marks: DataType.Mark[], record: DataType.Category) =>
            <EditableTagPanel
              data={ marks }
              editable={ editable }
              elementOnCreate={ saveMark(record.name) }
              elementOnRemove={ deleteMark(record.name) }
            />
          }
        />
        <Table.Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={ (tags: DataType.Tag[], record: DataType.Category) =>
            <EditableTagPanel
              data={ tags }
              editable={ editable }
              elementOnCreate={ saveTag(record.name) }
              elementOnRemove={ deleteTag(record.name) }
            />
          }
        />
      </Table>
      <CreationModal
        title="Please enter new dashboard information below:"
        visible={ newDashboardVisible }
        onSubmit={ newDashboard }
        onCancel={ () => setNewDashboardVisible(false) }
      />
    </div>
  )
}


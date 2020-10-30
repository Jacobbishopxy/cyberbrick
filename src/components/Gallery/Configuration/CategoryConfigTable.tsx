/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, {useState} from 'react'
import {Table, Tag} from "antd"
import {PlusOutlined} from '@ant-design/icons'

import {Editor} from "@/components/Editor"
import * as DataType from "../GalleryDataType"
import {CreationModal} from "../Misc/CreationModal"
import {TextBuilder} from "../Misc/TextBuilder"
import {EditableTagPanel} from "../Tag/EditableTagPanel"


export interface CategoryConfigTableProps {
  data: DataType.Category[]
  saveCategory: (categoryName: string, description?: string) => void
  modifyDashboardDescription: (dashboardName: string, description: string) => void
  saveMark: (categoryName: string, mark: DataType.Mark) => void
  deleteMark: (categoryName: string, mark: string) => void
  saveTag: (categoryName: string, tag: DataType.Tag) => void
  deleteTag: (categoryName: string, tag: string) => void
  newDashboard: (categoryName: string, dashboard: DataType.Dashboard) => void
}

/**
 * dealing with category creating & modifying
 */
export const CategoryConfigTable = (props: CategoryConfigTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)
  const [newDashboardVisible, setNewDashboardVisible] = useState<boolean>(false)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>()

  const modifyCategoryDescription = (categoryName: string) =>
    (description: string) => props.saveCategory(categoryName, description)

  const modifyDashboardDescription = (dashboardName: string) =>
    (description: string) => props.modifyDashboardDescription(dashboardName, description)

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

  const tableFooter = () =>
    editable ?
      {
        footer: () =>
          <TextBuilder
            create
            text="New category"
            saveNewText={props.saveCategory}
          />
      } : {}


  return (
    <div>
      <Table
        dataSource={props.data.map(i => ({...i, key: i.name}))}
        title={() =>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <span style={{fontWeight: "bold"}}>Category configuration</span>
            <Editor onChange={setEditable}/>
          </div>
        }
        size="small"
        bordered
        pagination={{pageSize: 10}}
        {...tableFooter()}
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
            render={(text: string, record: DataType.Category) =>
              editable ?
                <TextBuilder
                  text={text}
                  saveNewText={modifyCategoryDescription(record.name)}
                /> : text
            }
          />
        </Table.ColumnGroup>
        <Table.ColumnGroup title="Dashboard">
          <Table.Column
            title="Name"
            dataIndex={["dashboard", "name"]}
            key="dashboardName"
            render={(text: string, record: DataType.Category) =>
              text === null && editable ?
                <Tag
                  icon={<PlusOutlined/>}
                  onClick={() => openNewDashboardModal(record.name)}
                >
                  New Dashboard
                </Tag> : text
            }
          />
          <Table.Column
            title="Description"
            dataIndex={["dashboard", "description"]}
            key="dashboardDescription"
            render={(text: string, record: DataType.Category) =>
              editable && record.dashboard ?
                <TextBuilder
                  text={text}
                  saveNewText={modifyDashboardDescription(record.dashboard.name)}
                /> : text
            }
          />
        </Table.ColumnGroup>
        <Table.Column
          title="Marks"
          dataIndex="marks"
          key="marks"
          render={(marks: DataType.Mark[], record: DataType.Category) =>
            <EditableTagPanel
              name={`cm-${record.name}`}
              data={marks}
              editable={editable}
              elementOnCreate={saveMark(record.name)}
              elementOnRemove={deleteMark(record.name)}
              colorSelector
            />
          }
        />
        <Table.Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={(tags: DataType.Tag[], record: DataType.Category) =>
            <EditableTagPanel
              name={`ct-${record.name}`}
              data={tags}
              editable={editable}
              elementOnCreate={saveTag(record.name)}
              elementOnRemove={deleteTag(record.name)}
              colorSelector
            />
          }
        />
      </Table>
      <CreationModal
        title="Please enter new dashboard information below:"
        visible={newDashboardVisible}
        onSubmit={newDashboard}
        onCancel={() => setNewDashboardVisible(false)}
      />
    </div>
  )
}


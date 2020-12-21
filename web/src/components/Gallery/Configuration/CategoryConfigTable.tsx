/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, {useState} from 'react'
import {Table} from "antd"

import {Editor} from "@/components/Editor"
import {SpaceBetween} from "@/components/SpaceBetween"
import * as DataType from "../GalleryDataType"
import {TextBuilder} from "../Misc/TextBuilder"
import {EditableTagPanel} from "../Tag"


export interface CategoryConfigTableProps {
  data: DataType.Category[]

  saveCategory: (categoryName: string, description?: string) => void

  saveDashboard: (categoryName: string, dashboard: DataType.Dashboard) => void
  modifyDashboard: (dashboard: DataType.Dashboard) => void
  deleteDashboard: (categoryName: string, dashboard: string) => void

  saveMark: (categoryName: string, mark: DataType.Mark) => void
  modifyMark: (mark: DataType.Mark) => void
  deleteMark: (categoryName: string, mark: string) => void

  saveTag: (categoryName: string, tag: DataType.Tag) => void
  modifyTag: (tag: DataType.Tag) => void
  deleteTag: (categoryName: string, tag: string) => void
}

/**
 * dealing with category creating & modifying
 */
export const CategoryConfigTable = (props: CategoryConfigTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)

  const modifyCategoryDescription = (categoryName: string) =>
    (description: string) => props.saveCategory(categoryName, description)

  // todo: `React.useReducer` for state changes?
  const dashboardsOnChange = (categoryName: string) => (dashboards: DataType.Dashboard[]) => {

  }

  const marksOnChange = (categoryName: string) => (marks: DataType.Mark[]) => {

  }

  const tagsOnChange = (categoryName: string) => (tags: DataType.Tag[]) => {

  }

  return (
    <div>
      <Table
        dataSource={props.data.map(i => ({...i, key: i.name}))}
        title={() =>
          <SpaceBetween>
            <span style={{fontWeight: "bold"}}>Category configuration</span>
            <Editor onChange={setEditable} icons={{open: "Edit", close: "Save"}}/>
          </SpaceBetween>
        }
        size="small"
        bordered
        pagination={{pageSize: 10}}
        footer={
          editable ?
            () => <TextBuilder
              create
              text="New category"
              saveNewText={props.saveCategory}
            /> : undefined
        }
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

        <Table.Column
          title="Dashboards"
          dataIndex="dashboards"
          key="dashboards"
          render={(dashboards: DataType.Dashboard[], record: DataType.Category) =>
            <EditableTagPanel
              name={`db-${record.name}`}
              textCreation="new dashboard"
              data={dashboards}
              editable={editable}
              elementOnChange={dashboardsOnChange(record.name)}
            />
          }
        />

        <Table.Column
          title="Marks"
          dataIndex="marks"
          key="marks"
          render={(marks: DataType.Mark[], record: DataType.Category) =>
            <EditableTagPanel
              name={`cm-${record.name}`}
              textCreation="new mark"
              data={marks}
              editable={editable}
              elementOnChange={marksOnChange(record.name)}
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
              textCreation="new tag"
              data={tags}
              editable={editable}
              elementOnChange={tagsOnChange(record.name)}
              colorSelector
            />
          }
        />
      </Table>
    </div>
  )
}


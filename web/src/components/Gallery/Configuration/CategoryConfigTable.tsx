/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, {useState} from 'react'
import {Table} from "antd"
import {FormattedMessage} from "umi"

import {Editor} from "@/components/Editor"
import {SpaceBetween} from "@/components/SpaceBetween"
import * as DataType from "../GalleryDataType"
import {TextBuilder} from "../Misc/TextBuilder"
import {EditableTagPanel} from "../Tag"


export interface CategoryConfigTableProps {
  data: DataType.Category[]

  saveCategory: (categoryName: string, description?: string) => void
  updateDashboards: (categoryName: string, dashboards: DataType.Dashboard[]) => void
  updateMarks: (categoryName: string, marks: DataType.Mark[]) => void
  updateTags: (categoryName: string, tags: DataType.Tag[]) => void
}

/**
 * dealing with category creating & modifying
 */
export const CategoryConfigTable = (props: CategoryConfigTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)

  const modifyCategoryDescription = (categoryName: string) =>
    (description: string) => props.saveCategory(categoryName, description)

  const dashboardsOnChange = (categoryName: string) => (dashboards: DataType.Dashboard[]) =>
    props.updateDashboards(categoryName, dashboards)

  const marksOnChange = (categoryName: string) => (marks: DataType.Mark[]) =>
    props.updateMarks(categoryName, marks)

  const tagsOnChange = (categoryName: string) => (tags: DataType.Tag[]) =>
    props.updateTags(categoryName, tags)

  return (
    <div>
      <Table
        dataSource={props.data.map(i => ({...i, key: i.name}))}
        title={() =>
          <SpaceBetween>
            <span style={{fontWeight: "bold"}}>
              <FormattedMessage id="gallery.component.category-config-table1"/>
            </span>
            <Editor
              onChange={setEditable}
              icons={{
                open: <FormattedMessage id="gallery.component.general14"/>,
                close: <FormattedMessage id="gallery.component.general11"/>,
              }}
            />
          </SpaceBetween>
        }
        size="small"
        bordered
        pagination={{pageSize: 10}}
        footer={
          editable ?
            () => <TextBuilder
              create
              text={<FormattedMessage id="gallery.component.category-config-table2"/>}
              saveNewText={props.saveCategory}
            /> : undefined
        }
      >
        <Table.ColumnGroup
          title={<FormattedMessage id="gallery.component.general1"/>}
        >
          <Table.Column
            title={<FormattedMessage id="gallery.component.general5"/>}
            dataIndex="name"
            key="name"
          />
          <Table.Column
            title={<FormattedMessage id="gallery.component.general6"/>}
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
          title={<FormattedMessage id="gallery.component.general2"/>}
          dataIndex="dashboards"
          key="dashboards"
          render={(dashboards: DataType.Dashboard[], record: DataType.Category) =>
            <EditableTagPanel
              name={`db-${record.name}`}
              textCreation={<FormattedMessage id="gallery.component.category-config-table9"/>}
              textModification={<FormattedMessage id="gallery.component.category-config-table10"/>}
              textDeletion={"gallery.component.category-config-table11"}
              data={dashboards}
              editable={editable}
              elementOnChange={dashboardsOnChange(record.name)}
            />
          }
        />

        <Table.Column
          title={<FormattedMessage id="gallery.component.general3"/>}
          dataIndex="marks"
          key="marks"
          render={(marks: DataType.Mark[], record: DataType.Category) =>
            <EditableTagPanel
              name={`cm-${record.name}`}
              textCreation={<FormattedMessage id="gallery.component.category-config-table12"/>}
              textModification={<FormattedMessage id="gallery.component.category-config-table13"/>}
              textDeletion={"gallery.component.category-config-table14"}
              data={marks}
              editable={editable}
              elementOnChange={marksOnChange(record.name)}
              colorSelector
            />
          }
        />
        <Table.Column
          title={<FormattedMessage id="gallery.component.general4"/>}
          dataIndex="tags"
          key="tags"
          render={(tags: DataType.Tag[], record: DataType.Category) =>
            <EditableTagPanel
              name={`ct-${record.name}`}
              textCreation={<FormattedMessage id="gallery.component.category-config-table15"/>}
              textModification={<FormattedMessage id="gallery.component.category-config-table16"/>}
              textDeletion={"gallery.component.category-config-table17"}
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


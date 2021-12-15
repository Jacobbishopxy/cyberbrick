/**
 * Created by Jacob Xie on 10/3/2020.
 */

import { useState } from "react"
import { Table, Tag } from "antd"
import { FormattedMessage } from "umi"

import { Editor } from "@/components/Editor"
import { SpaceBetween } from "@/components/SpaceBetween"
import * as DataType from "../GalleryDataType"
import { EditableTagPanel } from "../Tag/EditableTagPanel"
import { CategoryTypeColor } from "./FieldView"


export interface DashboardConfigTableProps {
  data: DataType.Dashboard[]
  updateTemplates: (dashboardId: string, templates: DataType.Template[]) => void
}

/**
 * dealing with dashboard creating & modifying
 */
export const DashboardConfigTable = (props: DashboardConfigTableProps) => {

  const [editable, setEditable] = useState<boolean>(false)

  const templateOnChange = (dashboardId: string) =>
    (templates: DataType.Template[]) => props.updateTemplates(dashboardId, templates)

  return (
    <div>
      <Table
        dataSource={props.data.map(i => ({ ...i, key: i.name }))}
        title={() =>
          <SpaceBetween>
            <span style={{ fontWeight: "bold" }}>
              <FormattedMessage id="gallery.component.dashboard-config-table1" />
            </span>
            <Editor
              onChange={setEditable}
              icons={{
                open: <FormattedMessage id="gallery.component.general14" />,
                close: <FormattedMessage id="gallery.component.general69" />,
              }}
            />
          </SpaceBetween>
        }
        size="small"
        bordered
        pagination={false}
      >
        <Table.ColumnGroup
          title={<FormattedMessage id="gallery.component.general1" />}
        >
          <Table.Column
            title={<FormattedMessage id="gallery.component.general61" />}
            dataIndex={["category", "type"]}
            key="type"
            width={150}
            render={(text) => <Tag color={CategoryTypeColor[text]}>
              <FormattedMessage id={`gallery.component.category-config-table_type-${text}`} />
            </Tag>}
          />
          <Table.Column
            title={<FormattedMessage id="gallery.component.general5" />}
            dataIndex={["category", "name"]}
            key="category"
          />
        </Table.ColumnGroup>

        <Table.ColumnGroup
          title={<FormattedMessage id="gallery.component.general2" />}
        >
          <Table.Column
            title={<FormattedMessage id="gallery.component.general5" />}
            dataIndex="name"
            key="name"
          />
          <Table.Column
            title={<FormattedMessage id="gallery.component.general6" />}
            dataIndex="description"
            key="description"
          />
        </Table.ColumnGroup>
        <Table.Column
          title={<FormattedMessage id="gallery.component.general7" />}
          dataIndex="templates"
          key="templates"
          render={(templates: DataType.Template[], record: DataType.Dashboard) =>
            <EditableTagPanel
              name={`dt-${record.name}`}
              textCreation={<FormattedMessage id="gallery.component.dashboard-config-table2" />}
              textModification={<FormattedMessage id="gallery.component.dashboard-config-table3" />}
              textDeletion={"gallery.component.dashboard-config-table4"}
              data={templates}
              editable={editable}
              elementOnChange={templateOnChange(record.id!)}
            />
          }
        />
      </Table>
    </div>
  )
}


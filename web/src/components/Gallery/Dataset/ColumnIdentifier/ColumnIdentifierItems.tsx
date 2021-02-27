/**
 * Created by Jacob Xie on 1/18/2021
 */

import {useState} from "react"
import {Button, Form, Select, Space} from "antd"
import {DeleteTwoTone, PlusOutlined} from "@ant-design/icons"
import {FormattedMessage} from "umi"
import _ from "lodash"


const columnTypeOptions = [
  {
    type: "default",
    view: <FormattedMessage id="gallery.component.general29"/>
  },
  {
    type: "date",
    view: <FormattedMessage id="gallery.component.general30"/>
  },
  {
    type: "number",
    view: <FormattedMessage id="gallery.component.general31"/>
  },
  {
    type: "percent",
    view: <FormattedMessage id="gallery.component.general32"/>
  },
]

export interface ColumnIdentifierProps {
  columns: string[]
}

export const ColumnIdentifier = (props: ColumnIdentifierProps) => {

  const [columnsSelected, setColumnsSelected] = useState<string[]>([])

  const onColumnSelect = (idx: number) => (column: string) => {
    if (columnsSelected[idx]) {
      const ud = columnsSelected.map((c, i) =>
        idx === i ? column : c
      )
      setColumnsSelected(ud)
    } else
      setColumnsSelected([...columnsSelected, column])
  }

  const onColumnRemove = (idx: number) => {
    if (columnsSelected[idx]) {
      const ud = columnsSelected.filter((c, i) =>
        idx !== i
      )
      setColumnsSelected(ud)
    }
  }

  const getColumnsLeft = () => _.differenceWith(props.columns, columnsSelected)

  return (
    <Form.List name="display">
      {(fields, {add, remove}) =>
        <>
          {fields.map((field, idx) =>
            <Space key={field.key} style={{display: "flex"}}>
              <Form.Item
                {...field}
                name={[field.name, "column"]}
                fieldKey={[field.fieldKey, "column"]}
                label={<FormattedMessage id="gallery.component.general33"/>}
                rules={[{required: true, message: "Missing column"}]}
              >
                <Select
                  placeholder="Column"
                  style={{width: 150}}
                  onChange={onColumnSelect(idx)}
                >
                  {
                    getColumnsLeft().map(c =>
                      <Select.Option key={c} value={c}>{c}</Select.Option>
                    )
                  }
                </Select>
              </Form.Item>

              <Form.Item
                {...field}
                name={[field.name, "type"]}
                fieldKey={[field.fieldKey, "type"]}
                label={<FormattedMessage id="gallery.component.general16"/>}
                rules={[{required: true, message: "Missing field"}]}
              >
                <Select placeholder="Type" style={{width: 150}}>
                  {
                    columnTypeOptions.map(t =>
                      <Select.Option key={t.type} value={t.type}>
                        {t.view}
                      </Select.Option>
                    )
                  }
                </Select>
              </Form.Item>

              <Button
                icon={<DeleteTwoTone twoToneColor="red"/>}
                type="link"
                danger
                onClick={() => {
                  remove(field.name)
                  onColumnRemove(idx)
                }}
              />

            </Space>
          )}
          <Form.Item>
            <Button
              type="dashed"
              style={{width: 350}}
              icon={<PlusOutlined/>}
              onClick={() => add()}
            >
              <FormattedMessage id="gallery.component.column-identifier-items1"/>
            </Button>
          </Form.Item>
        </>
      }
    </Form.List>
  )
}


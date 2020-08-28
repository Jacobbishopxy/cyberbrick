/**
 * Created by Jacob Xie on 8/26/2020.
 */

import React, { useContext, useState } from "react"
import { Button, Card, Select, Space } from "antd"

import { CreationModal } from "../Misc/CreationModal"
import { ControllerProps } from "./data"
import { EditableContext } from "../GlobalContext"
import { Editor } from "../Misc"


export const Controller = (props: ControllerProps) => {
  const editable = useContext(EditableContext)
  const [visible, setVisible] = useState<boolean>(false)

  const categoryCreateModalOnOk = (value: any) => {
    props.onCreateCategory(value)
    setVisible(false)
  }

  return (
    <Card
      size="small"
    >
      <div style={ { display: 'flex', justifyContent: 'space-between' } }>
        <Space>
          <span style={ { fontWeight: "bold" } }>Category:</span>
          <Select
            style={ { width: 200 } }
            onChange={ props.onSelectCategory }
            size="small"
          >
            {
              props.categoryNames.map(n =>
                <Select.Option key={ n } value={ n }>
                  { n }
                </Select.Option>
              )
            }
          </Select>
        </Space>
        <Space>
          <Button
            type="primary"
            onClick={ () => setVisible(true) }
            size="small"
          >
            New Category
          </Button>
          <Editor editable={ editable } setEditable={ props.onEdit }/>
        </Space>
      </div>

      <CreationModal
        title="Please enter new category information below:"
        visible={ visible }
        onSubmit={ categoryCreateModalOnOk }
        onCancel={ () => setVisible(false) }
      />
    </Card>
  )
}

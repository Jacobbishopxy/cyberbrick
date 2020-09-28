/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useEffect, useState } from 'react'
import { Button, Modal, Select, Space } from 'antd'
import { ExclamationCircleOutlined } from "@ant-design/icons"

import * as DataType from "../../DataType"
import { AddModuleModal } from "./AddModuleModal"

export interface DashboardControllerProps {
  dashboardNames: string[]
  fetchDashboardMarks: (value: string) => Promise<DataType.Mark[]>
  markOnSelect: (value: string) => void
  onAddModule: (name: string, value: DataType.ElementType) => void
  onEditTemplate: (value: boolean) => void
  onSaveTemplate: () => Promise<void>
}

export const ModuleController = (props: DashboardControllerProps) => {

  const [edit, setEdit] = useState<boolean>(false)
  const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)
  const [marks, setMarks] = useState<DataType.Mark[]>([])

  useEffect(() => {
    props.onEditTemplate(edit)
  }, [edit])

  const dashboardOnSelect = (value: string) =>
    props.fetchDashboardMarks(value).then(res => setMarks(res))

  const quitAddModule = () => setAddModuleModalVisible(false)

  const saveTemplate = () => Modal.confirm({
    title: "Save current layout?",
    icon: <ExclamationCircleOutlined/>,
    onOk: () => props.onSaveTemplate().then(() => setEdit(false)),
    onCancel: () => setEdit(false)
  })

  const editMode = () => (
    <>
      <Space>
        <Button
          type="primary"
          size="small"
          onClick={ () => setAddModuleModalVisible(true) }
        >
          New module
        </Button>
        <Button
          size="small"
          danger
          onClick={ saveTemplate }
        >
          Exit
        </Button>

      </Space>
      <AddModuleModal
        onAddModule={ props.onAddModule }
        visible={ addModuleModalVisible }
        onQuit={ quitAddModule }
      />
    </>
  )

  const idleMode = () => (
    <Button
      type="primary"
      size="small"
      onClick={ () => setEdit(true) }
    >
      Edit
    </Button>
  )

  return (
    <div style={ { display: 'flex', justifyContent: 'space-between' } }>
      <Space>
        <Select
          style={ { width: 120 } }
          onSelect={ dashboardOnSelect }
        >
          {
            props.dashboardNames.map(n =>
              <Select.Option key={ n } value={ n }>{ n }</Select.Option>
            )
          }
        </Select>
        <Select
          style={ { width: 120 } }
          onSelect={ props.markOnSelect }
          disabled={ marks.length === 0 }
        >
          {
            marks.map(n =>
              <Select.Option key={ n.id } value={ n.name }>{ n.name }</Select.Option>
            )
          }
        </Select>
      </Space>
      <div>
        { edit ? editMode() : idleMode() }
      </div>
    </div>
  )
}


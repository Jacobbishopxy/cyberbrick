/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useEffect, useState } from 'react'
import { Button, Modal, Select, Space } from 'antd'
import { ExclamationCircleOutlined } from "@ant-design/icons"

import * as DataType from "../../DataType"
import { AddModuleModal } from "./AddModuleModal"

export interface ModuleControllerProps {
  markAvailable?: boolean
  canEdit: boolean
  dashboardNames: string[]
  dashboardOnSelect: () => void
  fetchDashboardMarks: (value: string) => Promise<DataType.Mark[]>
  markOnSelect: (value: string) => void
  onAddModule: (name: string, value: DataType.ElementType) => void
  onEditTemplate: (value: boolean) => void
  onSaveTemplate: () => Promise<void>
}

export const ModuleController = (props: ModuleControllerProps) => {

  const [edit, setEdit] = useState<boolean>(false)
  const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)
  const [marks, setMarks] = useState<DataType.Mark[]>([])

  useEffect(() => {
    props.onEditTemplate(edit)
  }, [edit])

  const dashboardOnSelect = (value: string) =>
    props.fetchDashboardMarks(value).then(res => {
      props.dashboardOnSelect()
      setMarks(res)
    })

  const quitAddModule = () => setAddModuleModalVisible(false)

  const saveTemplate = () => Modal.confirm({
    title: "Save current layout?",
    icon: <ExclamationCircleOutlined/>,
    onOk: () => props.onSaveTemplate().then(() => setEdit(false)),
    onCancel: () => setEdit(false),
    okText: "Confirm",
    cancelText: "Discard"
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
      disabled={ !props.canEdit }
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
          size="small"
          placeholder="Dashboard"
        >
          {
            props.dashboardNames.map(n =>
              <Select.Option key={ n } value={ n }>{ n }</Select.Option>
            )
          }
        </Select>
        {
          props.markAvailable ?
            <Select
              style={ { width: 120 } }
              onSelect={ props.markOnSelect }
              disabled={ marks.length === 0 }
              size="small"
              placeholder="Mark"
            >
              {
                marks.map(n =>
                  <Select.Option key={ n.id } value={ n.name }>{ n.name }</Select.Option>
                )
              }
            </Select> :
            <></>
        }
      </Space>
      <div>
        { edit ? editMode() : idleMode() }
      </div>
    </div>
  )
}

ModuleController.defaultProps = {
  markAvailable: false
} as Partial<ModuleControllerProps>


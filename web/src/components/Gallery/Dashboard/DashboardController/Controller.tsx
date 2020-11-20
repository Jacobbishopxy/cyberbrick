/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, {useEffect, useMemo, useState} from 'react'
import {Button, message, Modal, Select, Space} from 'antd'
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  PoweroffOutlined,
  SettingOutlined
} from "@ant-design/icons"

import {SpaceBetween} from "@/components/SpaceBetween"
import * as DataType from "../../GalleryDataType"
import {AddModuleModal} from "./AddModuleModal"


export interface ModuleControllerProps {
  markAvailable?: boolean
  canEdit: boolean
  dashboards: GalleryAPI.Dashboard[]
  dashboardOnSelect: (dashboardName: string) => Promise<DataType.Mark[] | undefined>
  markOnSelect: (value: string) => void
  onAddModule: (name: string, timeSeries: boolean, value: DataType.ElementType) => void
  onCopyTemplate: (dashboardName: string, templateName: string) => void
  onEditTemplate: (value: boolean) => void
  onSaveTemplate: () => Promise<void>
}

export const Controller = (props: ModuleControllerProps) => {

  const [edit, setEdit] = useState<boolean>(false)
  const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)
  const [marks, setMarks] = useState<DataType.Mark[]>([])

  useEffect(() => props.onEditTemplate(edit), [edit])

  const dashboardOnSelect = (value: string) =>
    props.dashboardOnSelect(value).then(res => {
      if (res) setMarks(res)
    })

  const quitAddModule = () => setAddModuleModalVisible(false)

  const saveTemplate = (exist: boolean) =>
    () => {
      const quit = () => exist ? setEdit(false) : undefined
      return Modal.confirm({
        title: "Save current layout and contents?",
        icon: <ExclamationCircleOutlined/>,
        onOk: () => props.onSaveTemplate()
          .then(() => {
            message.success("Template & contents saving successfully!")
            quit()
          })
          .catch(err => {
            message.error(`Error: ${err}`)
            quit()

          })
        ,
        onCancel: quit,
        okText: "Confirm",
        cancelText: "Discard"
      })
    }

  const editMode = useMemo(() => (
    <>
      <Space>
        <Button
          type="primary"
          size="small"
          onClick={() => setAddModuleModalVisible(true)}
        >
          <PlusCircleOutlined/> New
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={saveTemplate(false)}
        >
          <CheckCircleOutlined/> Save
        </Button>
        <Button
          size="small"
          danger
          onClick={saveTemplate(true)}
        >
          <PoweroffOutlined/> Exit
        </Button>

      </Space>
      <AddModuleModal
        dashboards={props.dashboards}
        onAddModule={props.onAddModule}
        copyTemplate={props.onCopyTemplate}
        visible={addModuleModalVisible}
        onQuit={quitAddModule}
      />
    </>
  ), [addModuleModalVisible, props.onSaveTemplate])

  const idleMode = useMemo(() => (
    <Button
      type="primary"
      size="small"
      onClick={() => setEdit(true)}
      disabled={!props.canEdit}
    >
      <SettingOutlined/> Edit
    </Button>
  ), [props.canEdit])

  return (
    <SpaceBetween>
      <Space>
        <Select
          style={{width: 120}}
          onSelect={dashboardOnSelect}
          size="small"
          placeholder="Dashboard"
        >
          {
            props.dashboards.map(d =>
              <Select.Option key={d.name} value={d.name}>{d.name}</Select.Option>
            )
          }
        </Select>
        {
          props.markAvailable ?
            <Select
              style={{width: 120}}
              onSelect={props.markOnSelect}
              disabled={marks.length === 0}
              size="small"
              placeholder="Mark"
            >
              {
                marks.map(m =>
                  <Select.Option key={m.id} value={m.name}>{m.name}</Select.Option>
                )
              }
            </Select> :
            <></>
        }
      </Space>
      <div>
        {edit ? editMode : idleMode}
      </div>
    </SpaceBetween>
  )
}

Controller.defaultProps = {
  markAvailable: false
} as Partial<ModuleControllerProps>


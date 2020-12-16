/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, {useEffect, useMemo, useState} from 'react'
import {Button, message, Modal, Space} from 'antd'
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  PoweroffOutlined,
  SettingOutlined
} from "@ant-design/icons"

import {SpaceBetween} from "@/components/SpaceBetween"
import * as DataType from "../../GalleryDataType"
import {SelectorPanel} from "./SelectorPanel"
import {AddModuleModal} from "./AddModuleModal"


export interface ModuleControllerProps {
  canEdit: boolean
  categories: DataType.Category[]
  categoryOnSelect: (categoryName: string, isCopy: boolean) => Promise<DataType.Dashboard[]>
  dashboardOnSelect: (id: string, isCopy: boolean) => Promise<DataType.Template[]>
  onAddModule: (name: string, timeSeries: boolean, value: DataType.ElementType) => void
  onCopyTemplate: (originTemplateId: string) => void
  onEditTemplate: (value: boolean) => void
  onSaveTemplate: () => Promise<void>
}

export const Controller = (props: ModuleControllerProps) => {

  const [edit, setEdit] = useState<boolean>(false)
  const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)

  useEffect(() => props.onEditTemplate(edit), [edit])

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
        onAddModule={props.onAddModule}
        categories={props.categories}
        categoryOnSelect={name => props.categoryOnSelect(name, true)}
        dashboardOnSelect={id => props.dashboardOnSelect(id, true)}
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
      <SelectorPanel
        categories={props.categories}
        categoryOnSelect={name => props.categoryOnSelect(name, false)}
        dashboardOnSelect={id => props.dashboardOnSelect(id, false)}
      />
      <div>
        {edit ? editMode : idleMode}
      </div>
    </SpaceBetween>
  )
}

Controller.defaultProps = {
  markAvailable: false
} as Partial<ModuleControllerProps>


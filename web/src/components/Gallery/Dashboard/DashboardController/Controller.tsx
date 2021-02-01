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
import {FormattedMessage, useIntl} from "umi"

import {SpaceBetween} from "@/components/SpaceBetween"
import * as DataType from "../../GalleryDataType"
import {SelectorPanel} from "./SelectorPanel"
import {AddModuleModal} from "./AddModuleModal"


export interface ModuleControllerProps {
  canEdit: boolean
  categories: DataType.Category[]
  categoryOnSelect: (categoryName: string, isCopy: boolean) => Promise<DataType.Category>
  dashboardOnSelect: (id: string, isCopy: boolean) => Promise<DataType.Dashboard>
  onAddModule: (name: string, timeSeries: boolean, value: DataType.ElementType) => void
  onCopyTemplate: (originTemplateId: string) => void
  onEditTemplate: (value: boolean) => void
  onSaveTemplate: () => Promise<void>
}

export const Controller = (props: ModuleControllerProps) => {
  const intl = useIntl()
  const [edit, setEdit] = useState<boolean>(false)
  const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)

  useEffect(() => props.onEditTemplate(edit), [edit])

  const quitAddModule = () => setAddModuleModalVisible(false)

  const saveTemplate = (exist: boolean) =>
    () => {
      const quit = () => exist ? setEdit(false) : undefined
      return Modal.confirm({
        title: intl.formatMessage({id: "gallery.component.dashboard-controller1"}),
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
          <PlusCircleOutlined/>
          <FormattedMessage id="gallery.component.general10"/>
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={saveTemplate(false)}
        >
          <CheckCircleOutlined/>
          <FormattedMessage id="gallery.component.general11"/>
        </Button>
        <Button
          size="small"
          danger
          onClick={saveTemplate(true)}
        >
          <PoweroffOutlined/>
          <FormattedMessage id="gallery.component.general12"/>
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
      <SettingOutlined/>
      <FormattedMessage id="gallery.component.general14"/>
    </Button>
  ), [props.canEdit])

  return (
    <SpaceBetween>
      <SelectorPanel
        categories={props.categories}
        categoryOnSelect={name => props.categoryOnSelect(name, false)}
        onSelectFinish={id => props.dashboardOnSelect(id, false)}
        size="small"
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


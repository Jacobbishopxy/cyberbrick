/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useEffect, useState } from 'react'
import { Button, Select, Space } from 'antd'

import * as DataType from "../../DataType"
import { AddModuleModal } from "./AddModuleModal"

export interface DashboardControllerProps {
  dashboardNames: string[]
  dashboardOnSelect: (value: string) => Promise<string[]>
  markOnSelect: (value: string) => void
  onAddModule: (value: DataType.ElementType) => void
  onEditTemplate: (value: boolean) => void
  onSaveTemplate: () => void
}

export const ModuleController = (props: DashboardControllerProps) => {

  const [edit, setEdit] = useState<boolean>(false)
  const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)
  const [markNames, setMarkNames] = useState<string[]>([])

  useEffect(() => {
    props.onEditTemplate(edit)
  }, [edit])

  const dashboardOnSelect = (value: string) =>
    props.dashboardOnSelect(value).then(res => setMarkNames(res))

  const quitAddModule = () => setAddModuleModalVisible(false)


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
          onClick={ () => setAddModuleModalVisible(false) }
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
      <div>
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
          disabled={ markNames.length === 0 }
        >
          {
            markNames.map(n =>
              <Select.Option key={ n } value={ n }>{ n }</Select.Option>
            )
          }
        </Select>
      </div>
      <div>
        { edit ? editMode() : idleMode() }
      </div>
    </div>
  )
}


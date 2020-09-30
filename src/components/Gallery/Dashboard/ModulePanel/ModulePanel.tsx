/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useEffect, useRef, useState } from 'react'
import { Modal } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons'
import moment from "moment"

import { ModulePanelHeader } from "./ModulePanelHeader"
import { ModulePanelFooter } from "./ModulePanelFooter"
import * as DataType from "../../DataType"
import { ConvertRefFR } from "../ModuleCollection/data"
import { moduleSelector } from "./moduleSelector"

import styles from "./Common.less"

export interface ModulePanelProps {
  headName: string
  timeSeries?: boolean
  elementType: DataType.ElementType
  content?: DataType.Content
  updateContent: (c: DataType.Content) => void
  onRemove: () => void
  editable: boolean
}

export const ModulePanel = (props: ModulePanelProps) => {

  const moduleRef = useRef<ConvertRefFR>(null)
  const selectModule = moduleSelector(props.elementType)

  const [editOn, setEditOn] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  useEffect(() => setContent(props.content), [props.content])

  const editContent = () => {
    if (props.editable) {
      setEditOn(!editOn)
      if (moduleRef.current) moduleRef.current.edit()
    }
  }

  const confirmDelete = () =>
    Modal.confirm({
      title: 'Delete this module?',
      icon: <ExclamationCircleOutlined/>,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => props.onRemove()
    })

  const updateTitle = (title: string) => {
    if (content) {
      const newContent = {
        ...content,
        title
      }
      setContent(newContent)
      props.updateContent(newContent)
    } else {
      const newContent = {
        title,
        data: {},
        date: moment().format()
      } as DataType.Content
      setContent(newContent)
      props.updateContent(newContent)
    }
  }

  const footerDate = () => {
    if (props.timeSeries && props.content)
      return { date: props.content.date }
    return {}
  }

  const headerDate = (date: string) => {
    if (props.timeSeries && content) {
      const newContent = {
        ...content,
        date
      }
      setContent(newContent)
      props.updateContent(newContent)
    }
  }

  const updateModuleContent = (ctt: DataType.Content) => {
    const newContent = {
      ...content,
      ...ctt
    }
    props.updateContent(newContent)
  }

  return (
    <div className={ styles.modulePanel }>
      <ModulePanelHeader
        editable={ props.editable }
        timeSeries={ props.timeSeries }
        headName={ props.headName }
        title={ props.content ? props.content.title : undefined }
        updateTitle={ updateTitle }
        editOn={ editOn }
        editContent={ editContent }
        confirmDelete={ confirmDelete }
        editDate={ headerDate }
      />
      {
        selectModule({
          content,
          updateContent: updateModuleContent,
          forwardedRef: moduleRef
        })
      }
      <ModulePanelFooter
        id={ props.content ? props.content.id : undefined }
        { ...footerDate() }
      />
    </div>
  )
}

ModulePanel.defaultProps = {
  timeSeries: false
} as Partial<ModulePanelProps>

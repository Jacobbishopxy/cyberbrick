/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useEffect, useRef, useState } from 'react'
import { Modal } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { ModulePanelHeader } from "./ModulePanelHeader"
import { ModulePanelFooter } from "./ModulePanelFooter"
import * as DataType from "../../DataType"
import { ConvertRefFR } from "../ModuleCollection/data"
import { moduleSelector } from "./moduleSelector"

import styles from "./Common.less"

export interface ModulePanelProps {
  elementType: DataType.ElementType
  content: DataType.Content
  updateContent: (c: DataType.Content) => void
  onRemove: () => void
  editable: boolean
}

export const ModulePanel = (props: ModulePanelProps) => {

  const moduleRef = useRef<ConvertRefFR>(null)
  const selectModule = moduleSelector(props.elementType)

  const [editOn, setEditOn] = useState<boolean>(false)
  const [content, setContent] = useState<DataType.Content>(props.content)

  useEffect(() => {
    setContent(props.content)
  }, [props.content])

  const editContent = () => {
    if (props.editable) {
      setEditOn(!editOn)
      if (moduleRef.current) moduleRef.current.edit()
    }
  }

  const confirmDelete = () =>
    Modal.confirm({
      title: '是否删除该模块？',
      icon: <ExclamationCircleOutlined/>,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        props.onRemove()
      }
    })

  return (
    <div className={ styles.modulePanel }>
      <ModulePanelHeader
        editable={ props.editable }
        title={ props.content.title }
        editOn={ editOn }
        editContent={ editContent }
        confirmDelete={ confirmDelete }
      />
      {
        selectModule({
          content,
          updateContent: props.updateContent,
          forwardedRef: moduleRef
        })
      }
      <ModulePanelFooter
      />
    </div>
  )
}


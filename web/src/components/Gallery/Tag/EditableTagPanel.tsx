/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, {useEffect, useState} from 'react'
import {Modal, Tag, Tooltip} from "antd"
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons"

import {CreationModal, CreationModalValue} from "../Misc/CreationModal"
import {GenericDataInput} from "./SelectableTags"

const tagDeleteModal = (onOk: () => void) =>
  Modal.confirm({
    title: "Are you sure to delete this tag?",
    icon: <ExclamationCircleOutlined/>,
    onOk,
    okText: "Confirm",
    cancelText: "Discard"
  })

export interface EditableTagPanelProps<T extends GenericDataInput> {
  name?: string
  text?: string
  data: T[]
  editable: boolean
  elementOnCreate: (value: T) => void
  elementOnRemove: (value: string) => void
  elementOnClick?: (value: string) => void

  colorSelector?: boolean
}

export const EditableTagPanel = <T extends GenericDataInput>(props: EditableTagPanelProps<T>) => {

  const [data, setData] = useState<T[]>(props.data)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  useEffect(() => setData(props.data), [props.data])

  const elementOnRemove = (value: string) => {
    if (props.elementOnRemove) props.elementOnRemove(value)
  }

  const tagCreateModalOnOk = (value: CreationModalValue) => {
    if (props.elementOnCreate) {
      props.elementOnCreate(value as T)
      setModalVisible(false)
    }
  }

  return (
    <>
      {
        data.map(t =>
          <Tooltip title={t.description} key={t.name}>
            <Tag
              closable={props.editable}
              onClose={e => {
                e.preventDefault()
                tagDeleteModal(() => elementOnRemove(t.name))
              }}
              color={t.color}
            >
              {t.name}
            </Tag>
          </Tooltip>
        )
      }
      {
        props.editable ?
          <Tag
            icon={<PlusOutlined/>}
            onClick={() => setModalVisible(true)}
          >
            {props.text}
          </Tag> : <></>
      }

      <CreationModal
        name={props.name}
        title={`Please enter ${props.text} information below:`}
        visible={modalVisible}
        onSubmit={tagCreateModalOnOk}
        onCancel={() => setModalVisible(false)}
        colorSelector={props.colorSelector}
      />
    </>
  )
}


EditableTagPanel.defaultProps = {
  text: "new tag",
  editable: false,
  colorSelector: false,
} as Partial<EditableTagPanelProps<GenericDataInput>>

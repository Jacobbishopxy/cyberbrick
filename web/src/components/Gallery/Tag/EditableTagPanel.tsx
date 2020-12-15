/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, {useState} from 'react'
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

  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const elementOnRemove = (value: string) => () => {
    if (props.elementOnRemove) props.elementOnRemove(value)
  }

  const tagCreateModalOnOk = (value: CreationModalValue) => {
    if (props.elementOnCreate) {
      props.elementOnCreate(value as T)
      setModalVisible(false)
    }
  }

  const idle = () =>
    props.data.map(t =>
      <Tooltip title={t.description} key={t.name}>
        <Tag color={t.color}>{t.name}</Tag>
      </Tooltip>
    )

  const livOnClickProp = (v: string) => () => {
    if (props.elementOnClick) props.elementOnClick(v)
  }

  const live = () =>
    <>
      {
        props.data.map(t =>
          <Tag
            closable
            onClose={e => {
              e.preventDefault()
              tagDeleteModal(elementOnRemove(t.name))
            }}
            color={t.color}
            onClick={livOnClickProp(t.name)}
          >
            {t.name}
          </Tag>
        )
      }
      <Tag
        icon={<PlusOutlined/>}
        onClick={() => setModalVisible(true)}
      >
        {props.text}
      </Tag>
    </>

  return (
    <>
      {props.editable ? live() : idle()}

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

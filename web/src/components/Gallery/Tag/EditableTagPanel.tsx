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
  textCreation?: string
  textModification?: string

  data: T[]
  editable: boolean
  elementOnCreate: (value: T) => void
  elementOnRemove: (value: string) => void
  elementOnClick?: (value: T) => void

  colorSelector?: boolean
}

export const EditableTagPanel = <T extends GenericDataInput>(props: EditableTagPanelProps<T>) => {

  const [creationVisible, setCreationVisible] = useState<boolean>(false)
  const [modificationVisible, setModificationVisible] = useState<boolean>(false)
  const [modifiedValue, setModifiedValue] = useState<T>()

  const elementOnRemove = (value: string) => () => {
    if (props.elementOnRemove) props.elementOnRemove(value)
  }

  const tagCreateModalOnOk = (value: CreationModalValue) => {
    props.elementOnCreate(value as T)
    setCreationVisible(false)
  }

  const activateModifyModal = (value: CreationModalValue) => () => {
    if (props.elementOnClick) {
      setModifiedValue(value as T)
      setModificationVisible(true)
    }
  }

  const tagModifyModalOnOk = (value: CreationModalValue) => {
    if (props.elementOnClick) {
      props.elementOnClick({...modifiedValue, ...value} as T)
      setModificationVisible(false)
    }
  }

  const idle = () =>
    props.data.map(t =>
      <Tooltip title={t.description} key={t.name}>
        <Tag color={t.color}>{t.name}</Tag>
      </Tooltip>
    )

  const live = () =>
    <>
      {
        props.data.map(t =>
          <Tag
            key={t.name}
            closable
            onClose={e => {
              e.preventDefault()
              tagDeleteModal(elementOnRemove(t.name))
            }}
            color={t.color}
            onClick={activateModifyModal(t)}
          >
            {t.name}
          </Tag>
        )
      }
      <Tag
        icon={<PlusOutlined/>}
        onClick={() => setCreationVisible(true)}
      >
        {props.textCreation}
      </Tag>
    </>

  const modificationModal = (v: T) =>
    <CreationModal
      name={`${props.name}-mod`}
      title={`Please enter ${props.textModification} information below:`}
      visible={modificationVisible}
      onSubmit={tagModifyModalOnOk}
      onCancel={() => setModificationVisible(false)}
      initialValues={v}
      colorSelector={props.colorSelector}
    />

  return (
    <>
      {props.editable ? live() : idle()}

      {
        props.elementOnClick && modifiedValue ?
          modificationModal(modifiedValue) : <></>
      }

      <CreationModal
        name={props.name}
        title={`Please enter ${props.textCreation} information below:`}
        visible={creationVisible}
        onSubmit={tagCreateModalOnOk}
        onCancel={() => setCreationVisible(false)}
        colorSelector={props.colorSelector}
      />
    </>
  )
}


EditableTagPanel.defaultProps = {
  textCreation: "new tag",
  textModification: "modify tag",
  editable: false,
  colorSelector: false,
} as Partial<EditableTagPanelProps<GenericDataInput>>

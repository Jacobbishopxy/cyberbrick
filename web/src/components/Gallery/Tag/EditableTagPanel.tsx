/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, {useState} from 'react'
import {Modal, Tag, Tooltip} from "antd"
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons"
import _ from "lodash"

import {CreationModal, CreationModalValue} from "../Misc/CreationModal"
import {DraggablePanel} from "@/components/DraggablePanel/DraggablePanel"
import {GenericDataInput, EditableTagPanelProps} from "./data"
import {useDidMountEffect} from "@/utilities/utils"


const tagDeleteModal = (onOk: () => void) =>
  Modal.confirm({
    title: "Are you sure to delete this tag?",
    icon: <ExclamationCircleOutlined/>,
    onOk,
    okText: "Confirm",
    cancelText: "Discard"
  })

export const EditableTagPanel = <T extends GenericDataInput>(props: EditableTagPanelProps<T>) => {

  const [items, setItems] = useState<T[]>(_.orderBy(props.data, ["index"]))

  const [creationVisible, setCreationVisible] = useState<boolean>(false)
  const [modificationVisible, setModificationVisible] = useState<boolean>(false)
  const [modifiedValue, setModifiedValue] = useState<T>()

  useDidMountEffect(() => props.elementOnChange(items), [items])

  const elementOnRemove = (value: string) => () =>
    setItems(items.filter(i => i.name !== value))

  const tagCreateModalOnOk = (value: CreationModalValue) => {
    setItems([...items, value as T])
    setCreationVisible(false)
  }

  const activateModifyModal = (value: CreationModalValue) => () => {
    setModifiedValue(value as T)
    setModificationVisible(true)
  }

  const tagModifyModalOnOk = (value: CreationModalValue) => {
    if (modifiedValue) {
      setItems(items.map(i => {
        if (i.id)
          return i.id === modifiedValue.id ? {...i, ...value} as T : i
        return  i.name === value.name ? {...i, ...value} as T : i
      }))
    }
    setModificationVisible(false)
  }

  const draggableOnChange = (ids: string[]) => {
    const newItems = _.sortBy(items, i => ids.indexOf(i.name))
    setItems(newItems)
  }

  const idle = () =>
    items.map(t =>
      <Tooltip title={t.description} key={t.name}>
        <Tag color={t.color}>{t.name}</Tag>
      </Tooltip>
    )

  const live = () =>
    <div style={{display: "flex", overflow: "auto"}}>
      <DraggablePanel editable onChange={draggableOnChange}>
        {
          items.map(t =>
            <Tag
              id={t.name}
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
      </DraggablePanel>
      <Tag
        icon={<PlusOutlined/>}
        onClick={() => setCreationVisible(true)}
      >
        {props.textCreation}
      </Tag>
    </div>

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

      {modificationVisible && modifiedValue ? modificationModal(modifiedValue) : <></>}

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

import * as service from "@/services/targetTag"
import { Input, Modal, Tag, Tooltip } from "antd"
import React, { useState } from "react"
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons"

/**
 * Created by Jacob Xie on 8/16/2020.
 */

interface NewTagInfo {
  name: string
  description?: string
}

interface TagsViewProps {
  tags: service.Tag[]
  editable: boolean
  tagOnCreate?: (value: NewTagInfo) => Promise<void>
  tagOnRemove?: (value: string) => Promise<void>
}

interface TagCreateModalProps {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  inputName: (vale: string) => void
  inputDescription: (value: string) => void
}

const TagCreateModal = (props: TagCreateModalProps) =>
  <Modal
    title="Please enter new tag information below:"
    visible={ props.visible }
    onOk={ props.onOk }
    onCancel={ props.onCancel }
    destroyOnClose
  >
    <span>Name:</span>
    <Input onBlur={ e => props.inputName(e.target.value) }/>
    <span>Description:</span>
    <Input onBlur={ e => props.inputDescription(e.target.value) }/>
  </Modal>

const tagDeleteModal = (onOk: () => void) =>
  Modal.confirm({
    title: "Are you sure to delete this tag?",
    icon: <ExclamationCircleOutlined/>,
    onOk,
    okText: "Confirm",
    cancelText: "Discard"
  })


export const TagsView = (props: TagsViewProps) => {

  const [newTagInfo, setNewTagInfo] = useState<NewTagInfo>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const inputNewTagName = (name: string) =>
    setNewTagInfo({ ...newTagInfo, name })

  const inputNewTagDescription = (description: string) => {
    if (newTagInfo !== undefined)
      setNewTagInfo({ ...newTagInfo, description })
  }

  const tagOnRemove = (value: string) => {
    if (props.tagOnRemove)
      props.tagOnRemove(value).then()
  }

  const modalOnOk = () => {
    if (props.tagOnCreate && newTagInfo) {
      props.tagOnCreate(newTagInfo)
        .then(() => setModalVisible(false))
    }
  }


  return (
    <>
      {
        props.tags.map(t =>
          <Tooltip title={ t.description } key={ t.name }>
            <Tag
              closable={ props.editable }
              onClose={ (e: any) => {
                e.preventDefault()
                tagDeleteModal(() => tagOnRemove(t.name))
              } }
            >
              { t.name }
            </Tag>
          </Tooltip>
        )
      }
      {
        props.editable ?
          <>
            <Tag onClick={ () => setModalVisible(true) }>
              <PlusOutlined/> New Tag
            </Tag>
          </> :
          <></>
      }
      <TagCreateModal
        visible={ modalVisible }
        onOk={ modalOnOk }
        onCancel={ () => setModalVisible(false) }
        inputName={ inputNewTagName }
        inputDescription={ inputNewTagDescription }
      />
    </>
  )
}

TagsView.degaultProps = {
  closable: false,
  tagOnCreate: undefined,
  tagOnRemove: undefined,
}

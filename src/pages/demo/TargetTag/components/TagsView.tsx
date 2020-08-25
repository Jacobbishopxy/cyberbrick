import { Input, Modal, Select, Tag, Tooltip } from "antd"
import React, { useEffect, useState } from "react"
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons"

import * as propsData from "./data"

/**
 * Created by Jacob Xie on 8/16/2020.
 */


const TagCreateModal = (props: propsData.TagCreateModalProps) =>
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

const TagSelectModal = (props: propsData.TagSelectModalProps) =>
  <Modal
    title="Please select tags from below:"
    visible={ props.visible }
    onOk={ props.onOk }
    onCancel={ props.onCancel }
    destroyOnClose
  >
    <Select
      mode="multiple"
      onChange={ props.selectNames }
      style={ { width: "100%" } }
    >
      {
        props.tagsNameExclude.map(n =>
          <Select.Option key={ n } value={ n }>
            { n }
          </Select.Option>
        )
      }
    </Select>
  </Modal>

const tagDeleteModal = (onOk: () => void) =>
  Modal.confirm({
    title: "Are you sure to delete this tag?",
    icon: <ExclamationCircleOutlined/>,
    onOk,
    okText: "Confirm",
    cancelText: "Discard"
  })


export const TagsView = (props: propsData.TagsViewProps) => {

  const [tags, setTags] = useState<API.Tag[]>(props.tags)
  const [tagsExclude, setTagsExclude] = useState<string[] | undefined>(props.tagsNameExclude)
  const [tagsToUpdate, setTagsToUpdate] = useState<string[]>([])
  const [newTagInfo, setNewTagInfo] = useState<API.Tag>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  useEffect(() => {
    setTags(props.tags)
  }, [props.tags])

  useEffect(() => {
    setTagsExclude(props.tagsNameExclude)
  }, [props.tagsNameExclude])

  const inputNewTagName = (name: string) =>
    setNewTagInfo({ ...newTagInfo, name })

  const inputNewTagDescription = (description: string) => {
    if (newTagInfo !== undefined)
      setNewTagInfo({ ...newTagInfo, description })
  }

  const selectNewTagName = (names: string[]) =>
    setTagsToUpdate(names)

  const tagOnRemove = (value: string) => {
    if (props.tagOnRemove)
      props.tagOnRemove(value).then()
    if (!props.isTagPanel && props.tagsOnChange) {
      const newTags = tags.filter(t => t.name !== value)
      setTags(newTags)
      props.tagsOnChange(newTags)
    }
  }

  const tagCreateModalOnOk = () => {
    if (props.tagOnCreate && newTagInfo) {
      props.tagOnCreate(newTagInfo)
        .then(() => setModalVisible(false))
    }
  }

  const tagSelectModalOnOk = () => {
    if (props.tagsOnChange && tagsToUpdate.length !== 0) {
      const newTags = tags.concat(tagsToUpdate.map(t => ({ name: t })))
      setTags(newTags)
      props.tagsOnChange(newTags)
      setModalVisible(false)
    }
  }


  return (
    <>
      {
        tags.map(t =>
          <Tooltip title={ t.description } key={ t.name }>
            <Tag
              closable={ props.editable }
              onClose={ (e: any) => {
                e.preventDefault()
                tagDeleteModal(() => tagOnRemove(t.name))
              } }
              // onClick={ } // todo: isTagPanel -> filter targets
            >
              { t.name }
            </Tag>
          </Tooltip>
        )
      }
      {
        props.editable ?
          <Tag onClick={ () => setModalVisible(true) }>
            <PlusOutlined/> New Tag
          </Tag> : <></>
      }
      {
        props.isTagPanel ?
          <TagCreateModal
            visible={ modalVisible }
            onOk={ tagCreateModalOnOk }
            onCancel={ () => setModalVisible(false) }
            inputName={ inputNewTagName }
            inputDescription={ inputNewTagDescription }
          /> :
          <TagSelectModal
            tagsNameExclude={ tagsExclude! }
            visible={ modalVisible }
            onOk={ tagSelectModalOnOk }
            onCancel={ () => setModalVisible(false) }
            selectNames={ selectNewTagName }
          />
      }
    </>
  )
}

TagsView.defaultProps = {
  tagsNameExclude: [],
  editable: false,
  isTagPanel: true,
  tagOnCreate: undefined,
  tagOnRemove: undefined,
  tagsOnChange: undefined,
  tagsOnRemove: undefined,
} as Partial<propsData.TagsViewProps>


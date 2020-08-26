/**
 * Created by Jacob Xie on 8/16/2020.
 */

import { Input, Modal, Select, Tag, Tooltip } from "antd"
import React, { useEffect, useState } from "react"
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons"

import * as propsData from "./data"


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
        props.tagsExcluded.map(n =>
          <Select.Option key={ n.name } value={ n.name }>
            { n.name }
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

  const genInitCategoryU = () => {
    if (props.category) {
      return {
        name: props.category.name,
        description: props.category.description
      }
    }
    return undefined
  }

  const [tags, setTags] = useState<API.Tag[]>(props.tags)
  const [tagsExcluded, setTagsExcluded] = useState<API.Tag[] | undefined>(props.tagsExcluded)
  const [tagsToUpdate, setTagsToUpdate] = useState<string[]>([])
  const [newCategoryInfo, setNewCategoryInfo] = useState<API.CategoryU | undefined>(genInitCategoryU())
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  useEffect(() => {
    setTags(props.tags)
  }, [props.tags])

  useEffect(() => {
    setTagsExcluded(props.tagsExcluded)
  }, [props.tagsExcluded])

  const inputNewTagName = (name: string) => {
    if (newCategoryInfo) {
      const newCat = {
        ...newCategoryInfo,
        tag: {
          ...newCategoryInfo.tag,
          name
        }
      }
      setNewCategoryInfo(newCat)
    }
  }

  const inputNewTagDescription = (description: string) => {
    if (newCategoryInfo && newCategoryInfo.tag?.name) {
      const newCat = {
        ...newCategoryInfo,
        tag: {
          ...newCategoryInfo.tag,
          description
        }
      }
      setNewCategoryInfo(newCat)
    }
  }

  const selectNewTagName = (names: string[]) =>
    setTagsToUpdate(names)

  const tagOnRemove = (value: string) => {
    if (props.tagOnRemove)
      props.tagOnRemove(value)

    if (!props.isTagPanel && props.tagsOnChange) {
      const newTags = tags.filter(t => t.name !== value)
      setTags(newTags)
      props.tagsOnChange(newTags)
    }
  }

  const tagCreateModalOnOk = () => {
    if (props.tagOnCreate && newCategoryInfo) {
      props.tagOnCreate(newCategoryInfo)
      setModalVisible(false)
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
            tagsExcluded={ tagsExcluded! }
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
  tagsExcluded: [],
  editable: false,
  isTagPanel: true,
  tagOnCreate: undefined,
  tagOnRemove: undefined,
  tagsOnChange: undefined,
  tagsOnRemove: undefined,
} as Partial<propsData.TagsViewProps>


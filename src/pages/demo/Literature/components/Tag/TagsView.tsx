/**
 * Created by Jacob Xie on 8/16/2020.
 */

import { Button, Divider, Modal, Select, Space, Tag, Tooltip } from "antd"
import React, { useContext, useEffect, useRef, useState } from "react"
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons"

import { SelectableTags, SelectableTagsRef } from "./SelectableTags"
import { SearchableContext } from "../Content"
import { CreationModal } from "../Misc/CreationModal"
import * as propsData from "../data"


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

  const tagSearchable = useContext(SearchableContext)
  const selectableTagsRef = useRef<SelectableTagsRef>(null)

  const [tags, setTags] = useState<API.Tag[]>(props.tags)
  const [tagsExcluded, setTagsExcluded] = useState<API.Tag[] | undefined>(props.tagsExcluded)
  const [tagsToUpdate, setTagsToUpdate] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([])

  useEffect(() => {
    setTags(props.tags)
  }, [props.tags])

  useEffect(() => {
    setTagsExcluded(props.tagsExcluded)
  }, [props.tagsExcluded])

  useEffect(() => {
    if (!tagSearchable && props.onSelectTags) {
      props.onSelectTags([])
      if (selectableTagsRef.current) selectableTagsRef.current.clearSelected()
    }
  }, [tagSearchable])


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

  const tagCreateModalOnOk = (value: API.Tag) => {
    if (props.tagOnCreate && props.category) {

      const newTag: API.CategoryU = {
        name: props.category.name,
        description: props.category.description,
        tag: value
      }
      props.tagOnCreate(newTag)
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

  const clearSelectedTagName = () => {
    if (props.onSelectTags) {
      props.onSelectTags([])
      if (selectableTagsRef.current) selectableTagsRef.current.clearSelected()
    }
    setSelectedTagNames([])
  }

  const nonSearchableTags = () =>
    tags.map(t =>
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

  const searchableTags = () =>
    <SelectableTags
      tags={ tags }
      onSelectTags={ setSelectedTagNames }
      ref={ selectableTagsRef }
    />


  return (
    <>
      {
        tagSearchable ? searchableTags() : nonSearchableTags()
      }
      {
        props.isTagPanel && tagSearchable ?
          <>
            <Divider/>
            <Space>
              <Button
                onClick={ () => props.onSelectTags!(selectedTagNames) }
                type="primary"
                size="small"
              >
                Search
              </Button>
              <Button
                onClick={ clearSelectedTagName }
                size="small"
              >
                Reset
              </Button>
            </Space>
          </> : <></>
      }
      {
        props.editable ?
          <Tag onClick={ () => setModalVisible(true) }>
            <PlusOutlined/> New Tag
          </Tag> : <></>
      }
      {
        props.isTagPanel ?
          <CreationModal
            title="Please enter new tag information below:"
            visible={ modalVisible }
            onSubmit={ tagCreateModalOnOk }
            onCancel={ () => setModalVisible(false) }
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


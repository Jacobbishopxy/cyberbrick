/**
 * Created by Jacob Xie on 8/28/2020.
 */

import { Button, Divider, Modal, Space, Tag, Tooltip } from "antd"
import React, { useContext, useEffect, useRef, useState } from "react"
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons"

import { SelectableTags, SelectableTagsRef } from "./SelectableTags"
import { SearchableContext } from "../index"
import { CreationModal } from "../Misc/CreationModal"
import { TagPanelProps } from "./data"


const tagDeleteModal = (onOk: () => void) =>
  Modal.confirm({
    title: "Are you sure to delete this tag?",
    icon: <ExclamationCircleOutlined/>,
    onOk,
    okText: "Confirm",
    cancelText: "Discard"
  })


export const TagPanel = (props: TagPanelProps) => {

  const tagSearchable = useContext(SearchableContext)
  const selectableTagsRef = useRef<SelectableTagsRef>(null)

  const [tags, setTags] = useState<API.Tag[]>(props.tags)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([])

  useEffect(() => {
    setTags(props.tags)
  }, [props.tags])


  useEffect(() => {
    if (!tagSearchable && props.tagOnSelect) {
      props.tagOnSelect([])
      if (selectableTagsRef.current) selectableTagsRef.current.clearSelected()
    }
  }, [tagSearchable])

  const tagOnRemove = (value: string) => {
    if (props.tagOnRemove)
      props.tagOnRemove(value)

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

  const clearSelectedTagName = () => {
    props.tagOnSelect([])
    if (selectableTagsRef.current) selectableTagsRef.current.clearSelected()
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
      { tagSearchable ? searchableTags() : nonSearchableTags() }
      {
        tagSearchable ?
          <>
            <Divider/>
            <Space>
              <Button
                onClick={ () => props.tagOnSelect(selectedTagNames) }
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

      <CreationModal
        title="Please enter new tag information below:"
        visible={ modalVisible }
        onSubmit={ tagCreateModalOnOk }
        onCancel={ () => setModalVisible(false) }
      />
    </>
  )
}

TagPanel.defaultProps = {
  editable: false
} as Partial<TagPanelProps>


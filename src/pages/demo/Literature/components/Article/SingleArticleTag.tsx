/**
 * Created by Jacob Xie on 8/28/2020.
 */

import React, { useEffect, useState } from "react"
import { Modal, Select, Tag, Tooltip } from "antd"
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons"

import { SingleArticleTagProps, TagSelectModalProps } from "./data"


const TagSelectModal = (props: TagSelectModalProps) =>
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


export const SingleArticleTag = (props: SingleArticleTagProps) => {

  const [tags, setTags] = useState<API.Tag[]>(props.tags)
  const [tagsExcluded, setTagsExcluded] = useState<API.Tag[] | undefined>(props.tagsExcluded)
  const [tagsToUpdate, setTagsToUpdate] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  useEffect(() => {
    setTags(props.tags)
  }, [props.tags])

  useEffect(() => {
    setTagsExcluded(props.tagsExcluded)
  }, [props.tagsExcluded])


  const selectNewTagName = (names: string[]) =>
    setTagsToUpdate(names)

  const tagOnRemove = (value: string) => {
    if (props.tagsOnChange) {
      const newTags = tags.filter(t => t.name !== value)
      setTags(newTags)
      props.tagsOnChange(newTags)
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
        props.editable && tagsExcluded ?
          <TagSelectModal
            tagsExcluded={ tagsExcluded }
            visible={ modalVisible }
            onOk={ tagSelectModalOnOk }
            onCancel={ () => setModalVisible(false) }
            selectNames={ selectNewTagName }
          /> : <></>
      }
    </>
  )
}

SingleArticleTag.defaultProps = {
  tagsExcluded: undefined,
  editable: false,
  tagsOnChange: undefined
} as Partial<SingleArticleTagProps>

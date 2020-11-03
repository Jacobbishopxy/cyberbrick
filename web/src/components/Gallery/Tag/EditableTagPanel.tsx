/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, {useEffect, useRef, useState} from 'react'
import {Button, Divider, Modal, Space, Tag, Tooltip} from "antd"
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons"

import {CreationModal, CreationModalValue} from "../Misc/CreationModal"
import {SelectableTags, SelectableTagsRef, GenericDataInput} from "./SelectableTags"

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
  data: T[]
  editable: boolean
  elementOnCreate: (value: T) => void
  elementOnRemove: (value: string) => void
  elementOnSelect?: (value: string[]) => void

  colorSelector?: boolean
  dataSearchable?: boolean
}

export const EditableTagPanel = <T extends GenericDataInput>(props: EditableTagPanelProps<T>) => {

  const selectableTagsRef = useRef<SelectableTagsRef>(null)

  const [data, setData] = useState<T[]>(props.data)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedDataNames, setSelectedDataNames] = useState<string[]>([])
  const [tagSearchable,] = useState(props.dataSearchable)

  useEffect(() => setData(props.data), [props.data])

  useEffect(() => {
    if (!tagSearchable && props.elementOnSelect) {
      props.elementOnSelect([])
      if (selectableTagsRef.current) selectableTagsRef.current.clearSelected()
    }
  }, [tagSearchable])

  const elementOnRemove = (value: string) => {
    if (props.elementOnRemove) props.elementOnRemove(value)
  }

  const tagCreateModalOnOk = (value: CreationModalValue) => {
    if (props.elementOnCreate) {
      props.elementOnCreate(value as T)
      setModalVisible(false)
    }
  }

  const elementSelect = () => {
    if (props.elementOnSelect) props.elementOnSelect(selectedDataNames)
  }

  const clearSelectedTagName = () => {
    if (props.elementOnSelect) props.elementOnSelect([])
    if (selectableTagsRef.current) selectableTagsRef.current.clearSelected()
    setSelectedDataNames([])
  }

  const nonSearchableTags = () =>
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

  const searchableTags = () =>
    <SelectableTags
      tags={data}
      onSelectTags={setSelectedDataNames}
      ref={selectableTagsRef}
    />

  return (
    <>
      {tagSearchable ? searchableTags() : nonSearchableTags()}
      {
        tagSearchable ?
          <>
            <Divider/>
            <Space>
              <Button
                onClick={elementSelect}
                type="primary"
                size="small"
              >
                Search
              </Button>
              <Button
                onClick={clearSelectedTagName}
                size="small"
              >
                Reset
              </Button>
            </Space>
          </> : <></>
      }
      {
        props.editable ?
          <Tag
            icon={<PlusOutlined/>}
            onClick={() => setModalVisible(true)}
          >
            New Tag
          </Tag> : <></>
      }

      <CreationModal
        name={props.name}
        title="Please enter new tag information below:"
        visible={modalVisible}
        onSubmit={tagCreateModalOnOk}
        onCancel={() => setModalVisible(false)}
        colorSelector={props.colorSelector}
      />
    </>
  )
}


EditableTagPanel.defaultProps = {
  editable: false,
  colorSelector: false,
  dataSearchable: false
} as Partial<EditableTagPanelProps<GenericDataInput>>

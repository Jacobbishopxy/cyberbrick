/**
 * Created by Jacob Xie on 10/13/2020.
 */

import React, { useState } from 'react'
import { Button, Modal, Select, Space, Tooltip } from "antd"

import { Emoji } from "@/components/Emoji"
import { Editor } from "@/components/Gallery/Misc/Editor"

const DragButton = () =>
  <Tooltip title='Drag'>
    <Button
      shape='circle'
      size='small'
      type='link'
      className='draggableHandler'
    >
      <Emoji label="drag" symbol="🧲️️️️️"/>
    </Button>
  </Tooltip>

const TimeSetButton = (props: { show: boolean | undefined, onClick: () => void }) =>
  props.show ?
    <Tooltip title="Date">
      <Button
        shape='circle'
        size='small'
        type='link'
        onClick={ props.onClick }
      >
        <Emoji label="date" symbol="🗓️"/>
      </Button>
    </Tooltip> : <></>

const EditButton = (props: { editContent: (value: boolean) => void }) =>
  <Tooltip title="Edit">
    <Editor
      icons={ { open: "⚙️", close: "❌️" } }
      onChange={ props.editContent }
    />
  </Tooltip>

const DeleteButton = (props: { confirmDelete: () => void }) =>
  <Tooltip title="Delete">
    <Button
      shape='circle'
      size='small'
      type='link'
      onClick={ props.confirmDelete }
    >
      <Emoji label="delete" symbol="🗑️️️"/>
    </Button>
  </Tooltip>

const TimePickButton = (props: { onClick: () => void }) =>
  <Tooltip title="Date">
    <Button
      shape='circle'
      size='small'
      type='link'
      onClick={ props.onClick }
    >
      <Emoji label="date" symbol="🗓️"/>
    </Button>
  </Tooltip>

interface TimePickModalProps {
  visible: boolean
  onOk: (date: string) => void
  onCancel: () => void
  dateList: string[]
}

const TimePickModal = (props: TimePickModalProps) => {

  const [selectedDate, setSelectedDate] = useState<string>()

  const onChange = (d: string) => setSelectedDate(d)

  const onOk = () => {
    if (selectedDate) props.onOk(selectedDate)
  }

  return <Modal
    title="Select a date"
    visible={ props.visible }
    onOk={ onOk }
    onCancel={ props.onCancel }
  >
    <Select
      showSearch
      style={ { width: 200 } }
      placeholder="Select a date"
      optionFilterProp="children"
      onChange={ onChange }
      filterOption={ (input, option) => {
        if (option) return option.children.indexOf(input) >= 0
        return false
      } }
    >
      {
        props.dateList.map(d =>
          <Select.Option value={ d } key={ d }>{ d }</Select.Option>
        )
      }
    </Select>
  </Modal>
}

export interface HeaderController {
  editable: boolean
  timeSeries?: boolean
  dateList?: string[]
  editContent: (value: boolean) => void
  confirmDelete: () => void
  onSelectDate?: (date: string) => void
}

// todo: current `HeaderController` is for `Dashboard`, need one for `Overview`
export const HeaderController = (props: HeaderController) => {

  const [dateModalVisible, setDateModalVisible] = useState<boolean>(false)

  const timePickModalOnOk = (date: string) => {
    if (props.onSelectDate) props.onSelectDate(date)
    setDateModalVisible(false)
  }

  const editableController = () =>
    <Space>
      <DragButton/>
      <TimeSetButton
        show={ props.timeSeries }
        onClick={ () => setDateModalVisible(true) }
      />
      <EditButton
        editContent={ props.editContent }
      />
      <DeleteButton
        confirmDelete={ props.confirmDelete }
      />
    </Space>

  const nonEditableController = () =>
    props.timeSeries && props.dateList ?
      <>
        <TimePickButton
          onClick={ () => setDateModalVisible(true) }
        />
        <TimePickModal
          visible={ dateModalVisible }
          onOk={ timePickModalOnOk }
          onCancel={ () => setDateModalVisible(false) }
          dateList={ props.dateList }
        />
      </> : <></>

  const genController = () => {
    if (props.editable) return editableController()
    return props.timeSeries && props.dateList ? nonEditableController() : <></>
  }

  return genController()
}


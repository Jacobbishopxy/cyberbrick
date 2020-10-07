/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Input, message, Modal, Row, Select, Space, Tooltip } from "antd"
import moment from "moment"

import { Emoji } from "@/components/Emoji"
import * as DataType from "@/components/Gallery/DataType"


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

const EditButton = (props: { editOn: boolean, editContent: () => void }) =>
  <Tooltip title="Edit">
    <Button
      shape='circle'
      size='small'
      type='link'
      onClick={ props.editContent }
    >
      {
        props.editOn ?
          <Emoji label="edit" symbol="❌️"/> :
          <Emoji label="edit" symbol="⚙️"/>
      }
    </Button>
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

interface TimeSetModalProps {
  show: boolean | undefined,
  visible: boolean,
  onOk: (isNew: boolean) => void,
  onCancel: () => void,
  editDate: (date: string) => void
}

const TimeSetModal = (props: TimeSetModalProps) => {

  const [isNew, setIsNew] = useState<boolean>(false)

  const dateOnChange = (date: moment.Moment | null) => {
    if (date !== null)
      props.editDate(date.format(DataType.dateFormat))
  }

  const onOk = () => props.onOk(isNew)

  return props.show ?
    <Modal
      title="Select a date"
      visible={ props.visible }
      onOk={ onOk }
      onCancel={ props.onCancel }
    >
      <DatePicker
        onChange={ dateOnChange }
        defaultValue={ moment() }
      />
      <br/>
      <Checkbox onChange={ e => setIsNew(e.target.checked) }>
        Create new content
      </Checkbox>
    </Modal> : <></>
}

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

interface ModulePanelHeaderProps {
  editable: boolean
  timeSeries?: boolean
  headName: string
  title: string | undefined
  updateTitle: (v: string) => void
  editOn: boolean
  editContent: () => void
  newContent: (date: string) => void
  confirmDelete: () => void
  dateList?: string[]
  editDate?: (date: string) => void
  onSelectDate?: (date: string) => void
}

interface DateModalVisible {
  set: boolean
  pick: boolean
}

export const ModulePanelHeader = (props: ModulePanelHeaderProps) => {

  const [titleEditable, setTitleEditable] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(props.title)
  const [dateModalVisible, setDateModalVisible] = useState<DateModalVisible>({ set: false, pick: false })
  const [selectedDate, setSelectedDate] = useState<string>()

  useEffect(() => setTitle(props.title), [props.title])

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value !== "") {
      setTitle(value)
      props.updateTitle(value)
    } else
      message.warning("title cannot be empty!")

    setTitleEditable(false)
  }

  const editDate = (date: string) => setSelectedDate(date)

  const timeSetModalOnOk = (isNew: boolean) => {
    if (props.editDate && selectedDate) {
      if (isNew) props.newContent(selectedDate)
      else props.editDate(selectedDate)
    }
    setDateModalVisible({ ...dateModalVisible, set: false })
  }

  const timePickModalOnOk = (date: string) => {
    if (props.onSelectDate) props.onSelectDate(date)
    setDateModalVisible({ ...dateModalVisible, pick: false })
  }

  const genTitle = () => {
    if (titleEditable)
      return <Input
        placeholder="Title"
        size="small"
        allowClear
        style={ { width: 200 } }
        onBlur={ changeTitle }
        defaultValue={ title }
      />
    if (props.editable)
      return <Button
        type="link"
        size="small"
        onClick={ () => setTitleEditable(true) }
      >
        { title || "Please enter your title" }
      </Button>
    return title
  }

  const editableController = () =>
    <Space>
      <DragButton/>
      <TimeSetButton
        show={ props.timeSeries }
        onClick={ () => setDateModalVisible({ ...dateModalVisible, set: true }) }
      />
      <EditButton
        editOn={ props.editOn }
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
          onClick={ () => setDateModalVisible({ ...dateModalVisible, pick: true }) }
        />
        <TimePickModal
          visible={ dateModalVisible.pick }
          onOk={ timePickModalOnOk }
          onCancel={ () => setDateModalVisible({ ...dateModalVisible, pick: false }) }
          dateList={ props.dateList }
        />
      </> : <></>

  const genController = () => {
    if (props.editable) return editableController()
    return props.timeSeries && props.dateList ? nonEditableController() : <></>
  }

  return (
    <div>
      <Row style={ { paddingLeft: 10, paddingRight: 10, height: 25 } }>
        <Col span={ 8 }>{ props.headName }</Col>
        <Col span={ 8 } style={ { textAlign: "center" } }>
          { genTitle() }
        </Col>
        <Col span={ 8 } style={ { textAlign: "right" } }>
          { genController() }
        </Col>
      </Row>

      <TimeSetModal
        show={ props.timeSeries }
        visible={ dateModalVisible.set }
        onOk={ timeSetModalOnOk }
        onCancel={ () => setDateModalVisible({ ...dateModalVisible, set: false }) }
        editDate={ editDate }
      />
    </div>
  )
}


ModulePanelHeader.defaultProps = {
  timeSeries: false
} as Partial<ModulePanelHeaderProps>


/**
 * Created by Jacob Xie on 10/13/2020.
 */

import React, { useState } from 'react'
import { Checkbox, DatePicker, Modal, Select, Space } from "antd"
import moment from "moment"

import { DragButton, TimeSetButton, EditButton, DeleteButton, TimePickButton } from "./ControllerButtons"

interface TimeSetModalProps {
  show: boolean | undefined,
  visible: boolean,
  onOk: (isNew: boolean) => void,
  onCancel: () => void,
  editDate: (date: string) => void
}

const TimeSetModal = (props: TimeSetModalProps) => {

  const [isNew, setIsNew] = useState<boolean>(false)

  const dateOnChange = (date: moment.Moment | null, dateStr: string) => {
    if (date !== null) props.editDate(dateStr)
  }

  const onOk = () => props.onOk(isNew)

  return props.show ?
    <Modal
      title="Select a date"
      visible={ props.visible }
      onOk={ onOk }
      onCancel={ props.onCancel }
    >
      <Space direction="vertical">
        <DatePicker
          onChange={ dateOnChange }
          defaultValue={ moment() }
        />
        <Checkbox onChange={ e => setIsNew(e.target.checked) }>
          Create new content
        </Checkbox>
      </Space>
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

interface DateModalVisible {
  set: boolean
  pick: boolean
}

export interface HeaderController {
  editable: boolean
  timeSeries?: boolean
  dateList?: string[]
  editDate?: (date: string) => void
  editContent: (value: boolean) => void
  newContent: (date: string) => void
  confirmDelete: () => void
  onSelectDate?: (date: string) => void
}

// todo: current `HeaderController` is for `Dashboard`, need one for `Overview`
export const HeaderController = (props: HeaderController) => {

  const [dateModalVisible, setDateModalVisible] = useState<DateModalVisible>({ set: false, pick: false })
  const [selectedDate, setSelectedDate] = useState<string>()

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

  const editableController = () =>
    <Space>
      <DragButton/>
      <TimeSetButton
        show={ props.timeSeries }
        onClick={ () => setDateModalVisible({ ...dateModalVisible, set: true }) }
      />
      <EditButton
        editContent={ props.editContent }
      />
      <DeleteButton
        confirmDelete={ props.confirmDelete }
      />
      <TimeSetModal
        show={ props.timeSeries }
        visible={ dateModalVisible.set }
        onOk={ timeSetModalOnOk }
        onCancel={ () => setDateModalVisible({ ...dateModalVisible, set: false }) }
        editDate={ setSelectedDate }
      />
    </Space>

  const nonEditableController = () =>
    props.timeSeries && props.dateList ?
      <Space>
        <TimePickButton
          onClick={ () => setDateModalVisible({ ...dateModalVisible, pick: true }) }
        />
        <TimePickModal
          visible={ dateModalVisible.pick }
          onOk={ timePickModalOnOk }
          onCancel={ () => setDateModalVisible({ ...dateModalVisible, pick: false }) }
          dateList={ props.dateList }
        />
      </Space> : <></>

  const genController = () => {
    if (props.editable) return editableController()
    return props.timeSeries && props.dateList ? nonEditableController() : <></>
  }

  return genController()
}


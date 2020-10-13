/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Input, message, Modal, Row } from "antd"
import moment from "moment"

import { HeaderController } from "./HeaderController"

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


interface ModulePanelHeaderProps {
  editable: boolean
  timeSeries?: boolean
  headName?: string
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

export const ModulePanelHeader = (props: ModulePanelHeaderProps) => {

  const [titleEditable, setTitleEditable] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(props.title)
  const [dateModalVisible, setDateModalVisible] = useState<boolean>(false)
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
    setDateModalVisible(false)
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

  const genController = () =>
    <HeaderController
      editable={ props.editable }
      timeSeries={ props.timeSeries }
      editOn={ props.editOn }
      editContent={ props.editContent }
      confirmDelete={ props.confirmDelete }
      dateList={ props.dateList }
      onSelectDate={ props.onSelectDate }
    />

  const genHead = () =>
    <Row style={ { paddingLeft: 10, paddingRight: 10, height: 25 } }>
      {
        props.headName ?
          <>
            <Col span={ 8 }>{ props.headName }</Col>
            <Col span={ 8 } style={ { textAlign: "center" } }>
              { genTitle() }
            </Col>
            <Col span={ 8 } style={ { textAlign: "right" } }>
              { genController() }
            </Col>
          </> :
          <>
            <Col span={ 12 } style={ { textAlign: "left" } }>
              { genTitle() }
            </Col>
            <Col span={ 12 } style={ { textAlign: "right" } }>
              { genController() }
            </Col>
          </>
      }
    </Row>

  return (
    <div>
      { genHead() }

      <TimeSetModal
        show={ props.timeSeries }
        visible={ dateModalVisible }
        onOk={ timeSetModalOnOk }
        onCancel={ () => setDateModalVisible(false) }
        editDate={ editDate }
      />
    </div>
  )
}


ModulePanelHeader.defaultProps = {
  timeSeries: false
} as Partial<ModulePanelHeaderProps>


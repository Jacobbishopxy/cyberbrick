/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useEffect, useState } from 'react'
import { Button, Col, DatePicker, Input, message, Modal, Row, Space, Tooltip } from "antd"
import moment from "moment"

import { Emoji } from "@/components/Emoji"

interface ModulePanelHeaderProps {
  editable: boolean
  timeSeries?: boolean
  headName: string
  title: string | undefined
  updateTitle: (v: string) => void
  editOn: boolean
  editContent: () => void
  confirmDelete: () => void
  editDate?: (date: string) => void
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

  const editDate = (date: moment.Moment | null, dateStr: string) =>
    setSelectedDate(dateStr)

  const dateModalOnOk = () => {
    if (props.editDate && selectedDate) props.editDate(selectedDate)
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

  const genEditor = () => {
    if (props.editable)
      return <Space>
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
        {
          props.timeSeries ?
            <Tooltip title="Date">
              <Button
                shape='circle'
                size='small'
                type='link'
                onClick={ () => setDateModalVisible(true) }
              >
                <Emoji label="date" symbol="🗓️"/>
              </Button>
            </Tooltip> :
            <></>
        }
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
      </Space>
    return <></>
  }

  return (
    <div>
      <Row style={ { paddingLeft: 10, paddingRight: 10 } }>
        <Col span={ 8 }>{ props.headName }</Col>
        <Col span={ 8 } style={ { textAlign: "center" } }>
          { genTitle() }
        </Col>
        <Col span={ 8 } style={ { textAlign: "right" } }>
          { genEditor() }
        </Col>
      </Row>

      {
        props.timeSeries ?
          <Modal
            title="Select a date"
            visible={ dateModalVisible }
            onOk={ dateModalOnOk }
            onCancel={ () => setDateModalVisible(false) }
          >
            <DatePicker
              onChange={ editDate }
              defaultValue={ moment() }
            />
          </Modal> :
          <></>
      }
    </div>
  )
}


ModulePanelHeader.defaultProps = {
  timeSeries: false
} as Partial<ModulePanelHeaderProps>


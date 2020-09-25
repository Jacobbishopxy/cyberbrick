/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useState } from 'react'
import { Button, DatePicker, Input, message, Modal, Space, Tooltip } from "antd"
import moment from "moment"

import { Emoji } from "@/components/Emoji"

import styles from "./Common.less"

interface ModulePanelHeaderProps {
  editable: boolean
  timeSeries?: boolean
  headName: string | undefined
  updateHead: (v: string) => void
  title: string | undefined
  updateTitle: (v: string) => void
  editOn: boolean
  editContent: () => void
  confirmDelete: () => void
  editDate?: (date: string) => void
}

export const ModulePanelHeader = (props: ModulePanelHeaderProps) => {

  const [headVisible, setHeadVisible] = useState<boolean>(true)
  const [titleVisible, setTitleVisible] = useState<boolean>(true)
  const [dateModalVisible, setDateModalVisible] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>()

  const changeHead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value !== "")
      props.updateHead(value)
    else
      message.warning("head cannot be empty!")

    setHeadVisible(true)
  }

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value !== "")
      props.updateTitle(value)
    else
      message.warning("title cannot be empty!")

    setTitleVisible(true)
  }

  const editDate = (date: moment.Moment | null, dateStr: string) =>
    setSelectedDate(dateStr)

  const dateModalOnOk = () => {
    if (props.editDate && selectedDate) props.editDate(selectedDate)
    setDateModalVisible(false)
  }


  return (
    <div className={ styles.modulePanelHeader }>
      {
        headVisible ?
          <Button
            type="link"
            size="small"
            onClick={ () => setHeadVisible(false) }
          >
            { props.headName ? props.headName : "Please enter your head" }
          </Button> :
          <Input
            placeholder="Head"
            size="small"
            allowClear
            onBlur={ changeHead }
          />
      }
      {
        titleVisible ?
          <Button
            type="link"
            size="small"
            onClick={ () => setTitleVisible(false) }
          >
            { props.title ? props.title : "Please enter your title" }
          </Button> :
          <Input
            placeholder="Title"
            size="small"
            allowClear
            onBlur={ changeTitle }
          />
      }
      {
        props.editable ?
          <Space>
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
          </Space> :
          <></>
      }
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


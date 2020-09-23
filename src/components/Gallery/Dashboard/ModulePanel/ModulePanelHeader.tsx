/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useState } from 'react'
import { Button, DatePicker, Modal, Space, Tooltip } from "antd"
import moment from "moment"

import { Emoji } from "@/components/Emoji"

import styles from "./Common.less"

interface ModulePanelHeaderProps {
  editable: boolean
  timeSeries?: boolean
  title: string | undefined
  editOn: boolean
  editContent: () => void
  confirmDelete: () => void
  editDate?: (date: string) => void
}

export const ModulePanelHeader = (props: ModulePanelHeaderProps) => {

  const [dateModalVisible, setDateModalVisible] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>()

  const editDate = (date: moment.Moment | null, dateStr: string) =>
    setSelectedDate(dateStr)

  const dateModalOnOk = () => {
    if (props.editDate && selectedDate) props.editDate(selectedDate)
    setDateModalVisible(false)
  }


  return (
    <div className={ styles.modulePanelHeader }>
      { props.title }
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


/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from 'react'
import { Button, Space, Tooltip } from "antd"

import { Emoji } from "@/components/Emoji"

import styles from "./Common.less"

interface ModulePanelHeaderProps {
  editable: boolean
  // timeSeries: boolean // todo: create new content by date
  title: string | undefined
  editOn: boolean
  editContent: () => void
  confirmDelete: () => void
}

export const ModulePanelHeader = (props: ModulePanelHeaderProps) =>
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
  </div>

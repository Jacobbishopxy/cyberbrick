/**
 * Created by Jacob Xie on 10/15/2020.
 */

import React from 'react'
import { Button, Tooltip } from "antd"

import { Emoji } from "@/components/Emoji"
import { Editor } from "@/components/Gallery/Misc/Editor"


export const DragButton = () =>
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

export const TimeSetButton = (props: { show: boolean | undefined, onClick: () => void }) =>
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

export const EditButton = (props: { editContent: (value: boolean) => void }) =>
  <Tooltip title="Edit">
    <Editor
      icons={ { open: "⚙️", close: "❌️" } }
      onChange={ props.editContent }
    />
  </Tooltip>

export const DeleteButton = (props: { confirmDelete: () => void }) =>
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

export const TimePickButton = (props: { onClick: () => void }) =>
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

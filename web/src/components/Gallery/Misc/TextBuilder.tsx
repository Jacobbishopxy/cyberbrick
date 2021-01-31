/**
 * Created by Jacob Xie on 9/21/2020.
 */

import React, {useState} from 'react'
import {Input, Space, Tag} from "antd"
import {CheckOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'

export interface TextBuilderProps {
  create?: boolean
  text?: string | React.ReactNode
  saveNewText: (value: string) => void
}

export const TextBuilder = (props: TextBuilderProps) => {

  const [editable, setEditable] = useState<boolean>(false)
  const [newText, setNewText] = useState<string>()

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewText(e.target.value)

  const saveNewText = () => {
    if (newText) props.saveNewText(newText)
    setEditable(false)
  }

  const inputDefaultValue = () => {
    if (props.create === false)
      return {defaultValue: props.text as string}
    return {}
  }

  const edit = () =>
    <Space>
      <Input
        {...inputDefaultValue()}
        onChange={inputOnChange}
        size="small"
      />
      <CheckOutlined
        onClick={saveNewText}
      />
    </Space>

  const nonEdit = () =>
    props.create ?
      <Tag
        icon={<PlusOutlined/>}
        onClick={() => setEditable(true)}
      >
        {props.text}
      </Tag> :
      <Space>
        {props.text}
        <EditOutlined
          onClick={() => setEditable(true)}
        />
      </Space>

  return <>{editable ? edit() : nonEdit()}</>

}

TextBuilder.defaultProps = {
  create: false
} as Partial<TextBuilderProps>


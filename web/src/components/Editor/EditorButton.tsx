/**
 * Created by Jacob Xie on 11/20/2020
 */

import React, {useState} from 'react'
import {Button} from "antd"

export interface EditorButtonProps {
  icons: { open: React.ReactNode, close: React.ReactNode }
  name: { open: React.ReactNode, close: React.ReactNode }
  type?: "text" | "link" | "ghost" | "default" | "primary" | "dashed" | undefined
  size?: "large" | "middle" | "small"
  shape?: "circle" | "round" | undefined
  defaultOpen?: boolean
  onChange: (value: boolean) => void
}

export const EditorButton = (props: EditorButtonProps) => {

  const buttonProps = {
    type: props.type,
    size: props.size || "middle",
    shape: props.shape
  }

  const [editable, setEditable] = useState<boolean>(props.defaultOpen || false)

  const editableOnChange = () => {
    setEditable(!editable)
    props.onChange(!editable)
  }

  return editable ?
    <Button
      {...buttonProps}
      icon={props.icons.close}
      onClick={editableOnChange}
    >
      {props.name.close}
    </Button> :
    <Button
      {...buttonProps}
      icon={props.icons.open}
      onClick={editableOnChange}
    >
      {props.name.open}
    </Button>

}

EditorButton.defaultProps = {
  defaultOpen: false
} as Partial<EditorButtonProps>


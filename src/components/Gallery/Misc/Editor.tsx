/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, { useEffect, useState } from "react"
import { Button } from "antd"

import { Emoji } from "@/components/Emoji"

interface EditorProps {
  icons?: { open: string | React.ReactNode, close: string | React.ReactNode } | boolean
  editable: boolean
  setEditable: (value: boolean) => void
}

export const Editor = (props: EditorProps) => {
  const [editable, setEditable] = useState<boolean>(props.editable)

  useEffect(() => props.setEditable(editable), [editable])

  const editableOnChange = () => setEditable(!editable)

  const show = () => {
    let closeIcon
    let openIcon

    if (props.icons && typeof props.icons !== "boolean") {
      if (typeof props.icons.close === "string")
        closeIcon = <Emoji label="edit" symbol={ props.icons.close }/>
      else
        closeIcon = props.icons.close
      if (typeof props.icons.open === "string")
        openIcon = <Emoji label="edit" symbol={ props.icons.open }/>
      else
        openIcon = props.icons.open
    } else {
      closeIcon = "Done"
      openIcon = "Edit"
    }
    return editable ? closeIcon : openIcon
  }

  return (
    <div>
      <Button
        shape="circle"
        size="small"
        type="link"
        onClick={ editableOnChange }
      >
        { show() }
      </Button>
    </div>
  )
}

Editor.defaultProps = {
  useIcon: false,
  icons: false,
} as Partial<EditorProps>

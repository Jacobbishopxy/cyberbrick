/**
 * Created by Jacob Xie on 9/18/2020.
 */

import React, { useEffect, useState } from "react"
import { Button } from "antd"

import { Emoji } from "@/components/Emoji"

interface EditorProps {
  useIcon?: boolean
  editable: boolean
  setEditable: (value: boolean) => void
}

export const Editor = (props: EditorProps) => {
  const [editable, setEditable] = useState<boolean>(props.editable)

  useEffect(() => props.setEditable(editable), [editable])

  const editableOnChange = () => setEditable(!editable)

  const iconC = () => editable ?
    <Emoji label="edit" symbol="❌️"/> :
    <Emoji label="edit" symbol="⚙️"/>

  const wordC = () => editable ?
    "Done" : "Edit"

  return (
    <div>
      <Button
        shape="circle"
        size="small"
        type="link"
        onClick={ editableOnChange }
      >
        { props.useIcon ? iconC() : wordC() }
      </Button>
    </div>
  )
}

Editor.defaultProps = {
  useIcon: false
} as Partial<EditorProps>

import React, { useEffect, useState } from "react"
import { Button } from "antd"

/**
 * Created by Jacob Xie on 8/16/2020.
 */

interface EditorProps {
  editable: boolean
  setEditable: (value: boolean) => void
}

export const Editor = (props: EditorProps) => {
  const [editable, setEditable] = useState<boolean>(props.editable)

  useEffect(() => {
    props.setEditable(editable)
  }, [editable])

  const editableOnChange = () => {
    setEditable(!editable)
  }

  return (
    <div>
      <Button
        shape="circle"
        size="small"
        type="link"
        onClick={ editableOnChange }
      >
        {
          editable ? "done" : "edit"
        }
      </Button>
    </div>
  )
}

/**
 * Created by Jacob Xie on 11/20/2020
 */

import React, { useState } from "react"
import { Button } from "antd"

import { Emoji } from "@/components/Emoji"

interface EditorProps {
    icons?: { open: string | React.ReactNode, close: string | React.ReactNode } | boolean
    defaultOpen?: boolean
    onChange: (value: boolean) => void
}

export const Editor = (props: EditorProps) => {
    const [editable, setEditable] = useState<boolean>(props.defaultOpen || false)

    const editableOnChange = () => {
        console.log(202020, editable)
        setEditable(!editable)
        props.onChange(!editable)
    }

    const show = () => {
        let closeIcon
        let openIcon

        if (props.icons && typeof props.icons !== "boolean") {
            if (typeof props.icons.close === "string")
                closeIcon = <Emoji label="edit" symbol={props.icons.close} />
            else
                closeIcon = props.icons.close
            if (typeof props.icons.open === "string")
                openIcon = <Emoji label="edit" symbol={props.icons.open} />
            else
                openIcon = props.icons.open
        } else {
            closeIcon = "Done"
            openIcon = "Edit"
        }
        return editable ? closeIcon : openIcon
    }

    return (
        <Button
            shape="circle"
            size="small"
            type="link"
            onClick={editableOnChange}
        >
            {show()}
        </Button>
    )
}

Editor.defaultProps = {
    icons: false,
    defaultOpen: false
} as Partial<EditorProps>


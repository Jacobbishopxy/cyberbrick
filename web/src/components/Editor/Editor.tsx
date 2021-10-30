/**
 * Created by Jacob Xie on 11/20/2020
 */

import React, { useState, useEffect, useContext } from "react"
import { Button } from "antd"

import { Emoji } from "@/components/Emoji"

import { Tooltip } from 'antd';
import * as DataType from "@/components/Gallery/GalleryDataType"
import { DashboardContext } from '@/components/Gallery/Dashboard/DashboardContext'
interface EditorProps {
    icons?: { open: string | React.ReactNode, close: string | React.ReactNode } | boolean
    defaultOpen?: boolean
    onChange: (value: boolean) => void
    timeSeries: string
    content: DataType.Content
    elementType: DataType.ElementType
}

export const Editor = (props: EditorProps) => {
    const [editable, setEditable] = useState<boolean>(props.defaultOpen || false)
    const [disabled, setDisabled] = useState(false)

    const Dashboard = useContext(DashboardContext)


    const editableOnChange = () => {
        console.log(202020, editable, props.elementType)
        if (props.elementType === DataType.ElementType.NestedModule) {
            if (Dashboard?.saveTemplate) {
                const t = Dashboard?.saveTemplate(props.content)
                console.log(3434, t)
            }

        }
        setEditable(!editable)
        props.onChange(!editable)
    }

    //时间序列功能下,为创建日期不可编辑.
    useEffect(() => {
        console.log(3030, props)
        if (props.timeSeries && !props.content?.date) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [props.timeSeries, props.content?.date])
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
    console.log(59, Dashboard, [props.content])
    return (
        disabled
            ?
            <Tooltip
                arrowPointAtCenter
                title='时间序列模块下,未选择日期无法编辑'
            >
                <Button
                    shape="circle"
                    size="small"
                    type="link"
                    onClick={editableOnChange}
                    disabled
                >
                    {show()}
                </Button>
            </Tooltip>
            : <Button
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


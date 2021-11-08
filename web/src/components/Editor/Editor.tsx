/**
 * Created by Jacob Xie on 11/20/2020
 */

import React, { useState, useEffect, useContext } from "react"
import { Button, message } from "antd"

import { Emoji } from "@/components/Emoji"

import { Tooltip } from 'antd';
import * as DataType from "@/components/Gallery/GalleryDataType"
import { DashboardContext } from '@/components/Gallery/Dashboard/DashboardContext'
import { await } from "signale";
interface EditorProps {
    icons?: { open: string | React.ReactNode, close: string | React.ReactNode } | boolean
    defaultOpen?: boolean
    onChange: (value: boolean) => void
    timeSeries: string
    elementType: DataType.ElementType
    headName: string

    content: DataType.Content
    setContent: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
}

export const Editor = (props: EditorProps) => {
    const [editable, setEditable] = useState<boolean>(props.defaultOpen || false)
    const [disabled, setDisabled] = useState(false)

    const Dashboard = useContext(DashboardContext)

    // "⚙️ false", "✔️ true"  点击事件 
    //将全部submodule发送给后端。
    const editableOnChange = async () => {
        console.log(202020, editable, props.elementType, props.content, Dashboard)
        //【嵌套模块】与【对勾】才保存
        if (editable && props.elementType === DataType.ElementType.NestedModule) {
            if (Dashboard?.updateElements) {
                //防止数据为空
                if (props.content?.data?.tabItems && props.content.data.tabItems.length != 0) {
                    try {
                        props.content.data.tabItems.forEach((v, i) => {
                            if (!v.type) {
                                throw i
                            }
                        })
                    } catch (i: any) {
                        message.error(`模块不允许为空，请编辑模块或删除`)
                        return
                    }
                    console.log(343434, props.content, props.setContent)
                    const newTabItems = await Dashboard?.updateElements(props.content?.data?.tabItems)
                    console.log(3434, props.content, newTabItems, props.setContent)
                    if (props.setContent) {
                        props.setContent((content) => {
                            return {
                                ...content,
                                data: {
                                    ...content?.data,
                                    tabItems: newTabItems
                                }
                            } as DataType.Content
                        })

                    }
                }
            }
        }
        setEditable(!editable)
        props.onChange(!editable)
    }

    //时间序列功能下,不创建日期不可编辑.
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


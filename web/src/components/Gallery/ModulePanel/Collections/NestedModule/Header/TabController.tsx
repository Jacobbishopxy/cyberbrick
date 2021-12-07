import { ElementType } from "@/components/Gallery/GalleryDataType"
import { tabContentChoice, tabItem } from "@/components/Gallery/ModulePanel/Collections/NestedModule/data"

import { getChoiceElement } from "@/components/Gallery/ModulePanel/Collections/NestedModule/Header/TabChoice"
import { FileAddOutlined, DeleteOutlined } from "@ant-design/icons"
import { Tooltip, Button } from "antd"
import { CSSProperties, useEffect, useState, useContext } from "react"
import { useIntl } from "umi"
import { TabItemSelection } from "./TabItemSelection"
import * as DataType from '@/components/Gallery/GalleryDataType'
import { DashboardContext } from "@/components/Gallery/Dashboard/DashboardContext"

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'

import { EditOutlined } from "@ant-design/icons";
interface TabControllerProps {
    // onAddSubModule: (name: string, timeSeries: boolean, moduleType: ElementType) => void;
    editable: boolean,
    style?: CSSProperties | undefined,
    className?: string | undefined,
    isHover: boolean,
    // isSelected: boolean,
    el: DataType.Element,
    // setItems?: React.Dispatch<React.SetStateAction<tabItem[]>>
    // onRemoveItem?: (i: string) => void
    addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType, isNested?: boolean) => boolean
    setDraggable: React.Dispatch<React.SetStateAction<boolean>>
    content: DataType.Content | undefined
    setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
    index: number
    removeTabItem: (index: number) => void
}
/*
This is the controller for tab item. It receives a boolean type 'isHover' from parent.

When 'isHover' is true, display 'editHeader', which is the controller of three buttons that used to
edit corresponding module, edit current tab content, and remove current tab.

'displayHeader' is used to display the content of the tab item.

'selected' is the selected choice from modal triggered by editHeader
*/
export const TabController = (props: TabControllerProps) => {
    const { el, index } = props
    //icon的类型
    // const [iconType, setIconType] = useState(el.headData?.iconType)
    //icon的内容
    // const [selected, setSelected] = useState('');
    // 控制modal显隐
    // const [addModuleModalVisible, setAddModuleModalVisible] = useState(false)
    const intl = useIntl()
    const NestedDedicatedProps = useContext(nestedDedicatedContext)

    // 监听selected, iconType变化，写入element
    // useEffect(() => {
    //     console.log("selected change", selected)
    //     if (selected && iconType) {
    //         //写入tab
    //         // if (props.setContent) {
    //         //     props.setContent((content) => {
    //         //         const newTabItems = content?.data?.tabItems.map((item, i) => {
    //         //             if (i === index) {
    //         //                 return {
    //         //                     ...item,
    //         //                     headData: {
    //         //                         iconContent: selected,
    //         //                         iconType: iconType
    //         //                     }
    //         //                 }
    //         //             } else {
    //         //                 return item
    //         //             }
    //         //         })
    //         //         return {
    //         //             ...content,
    //         //             data: {
    //         //                 ...content?.data,
    //         //                 tabItems: newTabItems
    //         //             }
    //         //         } as DataType.Content
    //         //     })
    //         // }

    //         // 写入elements
    //         if (NestedDedicatedProps?.setElements) {
    //             NestedDedicatedProps.setElements((allElements) => {

    //                 const newElements = allElements.map((v) => {
    //                     console.log(1022, v)
    //                     if (v.isSubmodule && v.name === el.name && NestedDedicatedProps.elementName === el.parentName) {
    //                         return {
    //                             ...v,
    //                             headData: {
    //                                 iconContent: selected,
    //                                 iconType: iconType
    //                             }
    //                         }
    //                     } else {
    //                         return v
    //                     }

    //                 })
    //                 console.log(102, newElements)
    //                 return newElements
    //             })
    //         }
    //     }
    // }, [selected, iconType])

    function onFinish(iconType: string, iconContent: string) {
        // 写入elements
        if (NestedDedicatedProps?.setElements) {
            NestedDedicatedProps.setElements((allElements) => {

                const newElements = allElements.map((v) => {
                    console.log(1022, v)
                    if (v.isSubmodule && v.name === el.name && NestedDedicatedProps.elementName === el.parentName) {
                        return {
                            ...v,
                            headData: {
                                iconContent,
                                iconType
                            }
                        }
                    } else {
                        return v
                    }

                })
                console.log(102, newElements)
                return newElements
            })
        }

        // console.log(tabType, input, selected)
    }


    // const quitAddModule = () => setAddModuleModalVisible(false)



    //pass 
    // const onAddTabItems = (name: string, timeSeries: boolean, moduleType: ElementType) => {
    //     props.onAddSubModule!(props.name, timeSeries, moduleType, el.i)
    // }
    const editHeader = (
        <div style={{
            position: 'absolute',
            display: 'flex',
            marginTop: "-12px",
            left: 0,
            top: 0
        }}>

            {/* 添加子模块 */}
            {/* <Tooltip title={intl.formatMessage({ id: "gallery.component.module-panel.nested-simple-module6" })}>
                <Button icon size='small' className="tab-controller-button"
                    onClick={() => {
                        setAddModuleModalVisible(true)
                        props.setDraggable(() => false)
                    }
                    }>
                    <FileAddOutlined />
                </Button>
            </Tooltip> */}

            {/*添加封面  */}
            <TabItemSelection
                onFinish={onFinish}
                trigger={<Tooltip title={intl.formatMessage({ id: "gallery.component.module-panel.nested-simple-module2" })}>
                    <Button size='small' icon className="tab-controller-button">
                        <EditOutlined />
                    </Button>
                </Tooltip>}
            />

            {/* 删除子模块 */}
            <Tooltip title={intl.formatMessage({ id: "gallery.component.general23" })}>
                <Button icon size='small' className="tab-controller-button"
                    onClick={() => props.removeTabItem(el)}
                >
                    <DeleteOutlined />
                </Button>
            </Tooltip>

        </div>)

    const displayHeader = () => {
        //get content from tabContent
        let headerContent: any = getChoiceElement(el.headData?.iconContent || "")


        //calculate fontSize based on the minimal of tab's dimension (width/height)
        const fontSize = (el.headData?.iconType === "text") ? "12px" : "40px"
        // console.log(el.i, selected)
        return (
            <span
                style={{ fontSize: fontSize }}
            >
                {headerContent}
            </span>)
    }

    return (
        <div >

            {/* 3个小图标 */}
            {props.editable && props.isHover ? editHeader : <></>}

            {/* 封面图标 */}
            <div>
                {displayHeader()}
            </div>

            {/* <AddModuleModal
                onAddSubModule={props.onAddSubModule}
                visible={addModuleModalVisible}
                onQuit={quitAddModule}
                addElement={props.addElement}
                setDraggable={props.setDraggable}
            /> */}
        </div>
    )
}